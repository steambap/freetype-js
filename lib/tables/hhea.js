module.exports = function (reader) {
	const ret = {reserved: []};
	ret.majorVersion = reader.readUInt16BE();
	ret.minorVersion = reader.readUInt16BE();
	ret.Ascender = reader.readInt16BE();
	ret.Descender = reader.readInt16BE();
	ret.LineGap = reader.readInt16BE();
	ret.advanceWidthMax = reader.readUInt16BE();
	ret.minLeftSideBearing = reader.readInt16BE();
	ret.minRightSideBearing = reader.readInt16BE();
	ret.xMaxExtent = reader.readInt16BE();
	ret.caretSlopeRise = reader.readInt16BE();
	ret.caretSlopeRun = reader.readInt16BE();
	ret.caretOffset = reader.readInt16BE();
	for (let i = 0; i < 4; i++) {
		ret.reserved.push(reader.readInt16BE());
	}
	ret.metricDataFormat = reader.readInt16BE();
	ret.numberOfHMetrics = reader.readUInt16BE();

	return ret;
};
