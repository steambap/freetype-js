const tagParse = require('./tag-parse');
const bufUtil = require('./buf-util');

const tags = [
	'cmap',
	'post'
];

function parse(buf) {
	const data = Buffer.from(buf);

	const sfntVersion = data.readUInt32BE(0);
	const numTables = data.readUInt16BE(4);
	const searchRange = data.readUInt16BE(6);
	const entrySelector = data.readUInt16BE(8);
	const rangeShift = data.readUInt16BE(10);

	const obj = {};

	const tabs = {};

	let offset = 12;
	for (let i = 0;i < numTables; i++) {
		const tag = bufUtil.readASCII32BE(data, offset);
		offset += 4;
		const checkSum = data.readUInt32BE(offset);
		offset += 4;
		const tableOffset = data.readUInt32BE(offset);
		offset += 4;
		const length = data.readUInt32BE(offset);
		offset += 4;

		tabs[tag] = {offset: tableOffset, checkSum, length};
	}

	tags.forEach(tag => {
		tag = tag.trim();
		const table = tabs[tag];
		if (tabs[tag]) {
			obj[tag] = tagParse[tag](data, table.offset, table.length, obj);
		}
	});

	return obj;
}

module.exports = parse;
