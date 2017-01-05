const cmap = require('./cmap');
const post = require('./post');
const os2 = require('./os-2');
const head = require('./head');
const hhea = require('./hhea');
const maxp = require('./maxp');
const name = require('./name');

module.exports = {
	cmap, head, hhea, maxp, name,
	'OS/2': os2,
	post
};
