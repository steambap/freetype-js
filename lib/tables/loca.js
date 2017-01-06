module.exports = function (reader, length, state) {
	const version = state.head.indexToLocFormat;
	const numGlyphs = state.maxp.numGlyphs;

	const offsetList = [];
	for (let i = 0; i < numGlyphs + 1; i++) {
		if (version === 0) {
			offsetList.push(reader.readUInt16BE() * 2);
		} else if (version === 1) {
			offsetList.push(reader.readUInt32BE());
		} else {
			throw new Error('Invalid index to location format: ' + version);
		}
	}

	return offsetList;
};
