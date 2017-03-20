'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = InlineSVG;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var processSVG = function processSVG(err, body, $, $svg, reject, resolve) {
	if (err) {
		return reject(err);
	}

	$svg.parent().append(body);
	$svg.remove();
	resolve($.html());
};

var replaceSVG = function replaceSVG($, $svg, req) {
	return new Promise(function (resolve, reject) {
		var src = $svg.attr('src');
		var remote = src.startsWith('http') || src.startsWith('//');

		var url = remote ? src : req.protocol + '://' + req.headers.host + src;
		(0, _request2.default)(url, function (err, res, body) {
			return processSVG(err, body, $, $svg, reject, resolve);
		});
	});
};

var getSVGs = function getSVGs(req, html) {
	var $ = _cheerio2.default.load(html);
	var $svgs = $('img[src*=".svg"]:not([data-convert-ignore])');
	return Promise.all($svgs.map(function (i, s) {
		return replaceSVG($, $(s), req);
	}));
};

function InlineSVG(req, html, callback) {
	getSVGs(req, html).then(function (parsed) {
		return callback(null, parsed);
	}).catch(function (err) {
		return callback(err, html);
	});
};
