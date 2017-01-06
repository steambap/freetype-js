const cmap = require('./cmap');
const post = require('./post');
const os2 = require('./os-2');
const head = require('./head');
const hhea = require('./hhea');
const hmtx = require('./hmtx');
const maxp = require('./maxp');
const name = require('./name');
const loca = require('./loca');

module.exports = {
	cmap, head, hhea, hmtx, maxp, name,
	'OS/2': os2,
	post, loca
};
