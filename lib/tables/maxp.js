module.exports = function (reader) {
	const ret = {};
	ret.version = reader.readFixed32BE();
	ret.numGlyphs = reader.readUInt16BE();

	if (ret.version === 1.0) {
		ret.maxPoints = reader.readUInt16BE();
		ret.maxContours = reader.readUInt16BE();
		ret.maxCompositePoints = reader.readUInt16BE();
		ret.maxCompositeContours = reader.readUInt16BE();
		ret.maxZones = reader.readUInt16BE();
		ret.maxTwilightPoints = reader.readUInt16BE();
		ret.maxStorage = reader.readUInt16BE();
		ret.maxFunctionDefs = reader.readUInt16BE();
		ret.maxInstructionDefs = reader.readUInt16BE();
		ret.maxStackElements = reader.readUInt16BE();
		ret.maxSizeOfInstructions = reader.readUInt16BE();
		ret.maxComponentElements = reader.readUInt16BE();
		ret.maxComponentDepth = reader.readUInt16BE();
	}

	return ret;
};
