function parse0(reader) {
	const ret = {panose: [], achVendID: []};
	ret.xAvgCharWidth = reader.readInt16BE();
	ret.usWeightClass = reader.readUInt16BE();
	ret.usWidthClass = reader.readUInt16BE();
	ret.fsType = reader.readUInt16BE();
	ret.ySubscriptXSize = reader.readInt16BE();
	ret.ySubscriptYSize = reader.readInt16BE();
	ret.ySubscriptXOffset = reader.readInt16BE();
	ret.ySubscriptYOffset = reader.readInt16BE();
	ret.ySuperscriptXSize = reader.readInt16BE();
	ret.ySuperscriptYSize = reader.readInt16BE();
	ret.ySuperscriptXOffset = reader.readInt16BE();
	ret.ySuperscriptYOffset = reader.readInt16BE();
	ret.yStrikeoutSize = reader.readInt16BE();
	ret.yStrikeoutPosition = reader.readInt16BE();
	ret.sFamilyClass = reader.readInt16BE();
	for (let i = 0; i < 10; i++) {
		ret.panose.push(reader.readUInt8());
	}
	ret.ulUnicodeRange1 = reader.readUInt32BE();
	ret.ulUnicodeRange2 = reader.readUInt32BE();
	ret.ulUnicodeRange3 = reader.readUInt32BE();
	ret.ulUnicodeRange4 = reader.readUInt32BE();
	for (let i = 0; i < 4; i++) {
		ret.achVendID.push(reader.readInt8());
	}
	ret.fsSelection = reader.readUInt16BE();
	ret.usFirstCharIndex = reader.readUInt16BE();
	ret.usLastCharIndex = reader.readUInt16BE();
	ret.sTypoAscender = reader.readInt16BE();
	ret.sTypoDescender = reader.readInt16BE();
	ret.sTypoLineGap = reader.readInt16BE();
	ret.usWinAscent = reader.readUInt16BE();
	ret.usWinDescent = reader.readUInt16BE();

	return ret;
}

function parse1(reader) {
	const ret = parse0(reader);

	ret.ulCodePageRange1 = reader.readUInt32BE();
	ret.ulCodePageRange2 = reader.readUInt32BE();

	return ret;
}

function parse2(reader) {
	const ret = parse1(reader);

	ret.sxHeight = reader.readInt16BE();
	ret.sCapHeight = reader.readInt16BE();
	ret.usDefaultChar = reader.readUInt16BE();
	ret.usBreakChar = reader.readUInt16BE();
	ret.usMaxContext = reader.readUInt16BE();

	return ret;
}

function parse5(reader) {
	const ret = parse2(reader);

	ret.usLowerOpticalPointSize = reader.readUInt16BE();
	ret.usUpperOpticalPointSize = reader.readUInt16BE();

	return ret;
}

module.exports = function (reader) {
	const version = reader.readUInt16BE();

	switch (version) {
		case 0:
			return parse0(reader.copy());

		case 1:
			return parse1(reader.copy());

		case 2: case 3: case 4:
			return parse2(reader.copy());

		case 5:
			return parse5(reader.copy());
	
		default:
			throw new Error('Unknown OS/2 table version: ', version);
	}
};
