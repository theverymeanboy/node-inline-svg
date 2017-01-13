var cheerio = require ( 'cheerio' );
var request = require ( 'request' );

var getSVGs = function getSVGs ( req , html , callback ) {
	var $     = cheerio.load ( html );
	var cache = {};
	
	var $imgs    = $ ( 'img[src*=".svg"]:not([data-convert-ignore])' );
	var promises = $imgs.length;
	
	$imgs.each ( function () {
		var $img   = $ ( this );
		var src    = $img.attr ( 'src' );
		var remote = src.startsWith ( 'http' ) || src.startsWith ( '//' );
		
		if ( ! cache.hasOwnProperty ( src.toString () ) ) {
			var url = remote ? src : req.protocol + '://' + req.headers.host + src;
			
			request ( url , function ( err , res , body ) {
				if ( ! err ) {
					cache[ src ] = body;
				}
				
				$img.parent ().append ( cache[ src ] );
				$img.remove ();
				
				promises --;
				if ( promises <= 0 ) {
					callback ( $.html () );
				}
			} );
		} else {
			$img.parent ().append ( cache[ src ] );
			$img.remove ();
			
			promises --;
			if ( promises <= 0 ) {
				callback ( $.html () );
			}
		}
	} );
};

var InlineSVG = function InlineSVG ( req , html , callback ) {
	getSVGs ( req , html , function ( parsedHtml ) {
		return callback ( parsedHtml );
	} );
};

module.exports = InlineSVG;