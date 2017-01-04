module.exports = function (reader,length) {
	const ret = {};
	ret.majorVersion = reader.readUInt16BE();
	ret.minorVersion = reader.readUInt16BE();
	ret.fontRevision = reader.readFixed32BE();
	ret.checkSumAdjustment = reader.readUInt32BE();
	ret.magicNumber = reader.readUInt32BE();
	ret.flags = reader.readUInt16BE();
	ret.unitsPerEm = reader.readUInt16BE();
	ret.created = reader.readLong64BE();
	ret.modified = reader.readLong64BE();
	ret.xMin = reader.readInt16BE();
	ret.yMin = reader.readInt16BE();
	ret.xMax = reader.readInt16BE();
	ret.yMax = reader.readInt16BE();
	ret.macStyle = reader.readUInt16BE();
	ret.lowestRecPPEM = reader.readUInt16BE();
	ret.fontDirectionHint = reader.readInt16BE();
	ret.indexToLocFormat = reader.readInt16BE();
	ret.glyphDataFormat = reader.readInt16BE();

	return ret;
};
