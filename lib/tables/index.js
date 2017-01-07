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

const kern = require('./kern');

module.exports = {
	cmap, head, hhea, maxp, name, hmtx,
	'OS/2': os2,
	post, cvt, fpgm, loca, kern
};
