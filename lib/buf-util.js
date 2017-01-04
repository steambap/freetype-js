/**
 * read a 32-bit signed fixed-point number (16.16)
 * return float
 */
function readFixed32BE(data, offset) {
	const whole = data.readInt16BE(offset);
	const frac = data.readInt16BE(offset + 2) / (256 * 256);

	return whole + frac;
}
/**
 * read a 4 byte identifier
 * return string
 */
function readASCII32BE(buf, offset) {
	let ret = '';
	for (let i = 0; i < 4; i++) {
		ret += String.fromCharCode(buf.readUInt8(offset + i));
	}

	return ret;
}

module.exports = {
	readFixed32BE, readASCII32BE
};
