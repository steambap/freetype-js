const Reader = require('./reader');
const tables = require('./tables');

const tags = [
	'cmap',
	'head',
	'hhea',
	'hmtx',
	'maxp',
	'name',
	'OS/2',
	'post',

	'cvt',
	'fpgm',
	'loca'
];

function parse(buf) {
	const ret = {};

	const reader = Reader.from(buf);

	ret.sfntVersion = reader.readUInt32BE();
	const numTables = ret.numTables = reader.readUInt16BE();
	ret.searchRange = reader.readUInt16BE();
	ret.entrySelector = reader.readUInt16BE();
	ret.rangeShift = reader.readUInt16BE();

	const tabs = {};

	for (let i = 0; i < numTables; i++) {
		const tag = reader.readASCII32BE();
		const checkSum = reader.readUInt32BE();
		const offset = reader.readUInt32BE();
		const length = reader.readUInt32BE();

		tabs[tag] = {offset, checkSum, length};
	}

	tags.forEach(tag => {
		tag = tag.trim();
		const table = tabs[tag];
		if (tabs[tag]) {
			ret[tag] = tables[tag](reader.at(table.offset), table.length, ret);
		}
	});

	return ret;
}

module.exports = parse;
