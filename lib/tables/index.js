const cmap = require('./cmap');
const post = require('./post');
const os2 = require('./os-2');
const head = require('./head');
const hhea = require('./hhea');
const hmtx = require('./hmtx');
const maxp = require('./maxp');
const name = require('./name');

const cvt = require('./cvt');
const fpgm = require('./fpgm');
const loca = require('./loca');

module.exports = {
	cmap, head, hhea, hmtx, maxp, name,
	'OS/2': os2,
	post, cvt, fpgm, loca
};
