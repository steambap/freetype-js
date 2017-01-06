function parse0(reader) {
	const ret = [];
	const nPairs = reader.readUInt16BE();
	reader.readUInt16BE();
	reader.readUInt16BE();
	reader.readUInt16BE();

	for (let i = 0; i < nPairs; i++) {
		const left = reader.readUInt16BE();
		const right = reader.readUInt16BE();
		const value = reader.readInt16BE();
		ret.push({left, value, right});
	}

	return ret;
}

module.exports = function (reader) {
	const ret = {subtable: []};
	ret.version = reader.readUInt16BE();
	const nTables = ret.nTables = reader.readUInt16BE();

	for (let i = 0; i < nTables; i++) {
		reader.readUInt16BE();
		reader.readUInt16BE();
		const coverage = reader.readUInt16BE();
		const format = coverage >>> 8;

		if (format === 0) {
			ret.subtable.push(parse0(reader));
		} else {
			throw new Error('Unknown kern table format: ' + format);
		}
	}
};
