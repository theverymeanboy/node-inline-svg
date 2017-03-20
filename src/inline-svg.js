import cheerio from'cheerio';
import request from 'request';

const processSVG = ( err , body , $ , $svg , reject , resolve ) => {
	if ( err ) {
		return reject ( err );
	}
	
	$svg.parent ().append ( body );
	$svg.remove ();
	resolve ( $.html () );
};

const replaceSVG = ( $ , $svg , req ) => new Promise ( ( resolve , reject ) => {
	const src    = $svg.attr ( 'src' );
	const remote = src.startsWith ( 'http' ) || src.startsWith ( '//' );
	
	const url = remote ? src : req.protocol + '://' + req.headers.host + src;
	request ( url , ( err , res , body ) => processSVG ( err , body , $ , $svg , reject , resolve ) );
} );

const getSVGs = ( req , html ) => {
	const $     = cheerio.load ( html );
	const $svgs = $ ( 'img[src*=".svg"]:not([data-convert-ignore])' );
	return Promise.all ( $svgs.map ( ( i , s ) => replaceSVG ( $ , $ ( s ) , req ) ) );
};

export default function InlineSVG ( req , html , callback ) {
	getSVGs ( req , html )
		.then ( parsed => callback ( null , parsed ) )
		.catch ( err => callback ( err , html ) );
};