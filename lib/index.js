const Reader = require('./reader');
const tables = require('./tables');

const tags = [
	'cmap',
	'head',
	'hhea',
	'maxp',
	'name',
	'OS/2',
	'post'
];

function parse(buf) {
	const reader = Reader.from(buf);

	const sfntVersion = reader.readUInt32BE();
	const numTables = reader.readUInt16BE();
	const searchRange = reader.readUInt16BE();
	const entrySelector = reader.readUInt16BE();
	const rangeShift = reader.readUInt16BE();

	const obj = {};

	const tabs = {};

	for (let i = 0;i < numTables; i++) {
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
			obj[tag] = tables[tag](reader.at(table.offset), table.length, obj);
		}
	});

	return obj;
}

module.exports = parse;
