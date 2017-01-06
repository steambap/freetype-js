module.exports = function (reader) {
	const ret = {};

	ret.version = reader.readFixed32BE();
	ret.italicAngle = reader.readUInt32BE();
	ret.underlinePosition = reader.readInt16BE();
	ret.underlineThickness = reader.readInt16BE();

	return ret;
};
