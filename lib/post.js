const bufUtil = require('./buf-util');

module.exports = function (data, offset, length) {
	const ret = {};

	ret.version = bufUtil.readFixed32BE(data, offset);
	offset += 4;
	
	ret.italicAngle = data.readUInt32BE(offset);
	offset += 4;

	ret.underlinePosition = data.readInt16BE(offset);
	offset += 2;

	ret.underlineThickness = data.readInt16BE(offset);
	offset += 2;

	return ret;
};
