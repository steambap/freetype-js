const Buffer = require('buffer').Buffer;
/**
 * a simple wrapper around buffer for
 * offset position tracking
 */
function Reader(buf, pos) {
	this.buf = buf;
	this.pos = pos;
}

const rp = Reader.prototype;
/**
 * read a 32-bit signed fixed-point number (16.16)
 * return float
 */
rp.readFixed32BE = function () {
	const offset = this.pos;
	this.pos += 4;

	const whole = this.buf.readInt16BE(offset);
	const frac = this.buf.readInt16BE(offset + 2) / (256 * 256);

	return whole + frac;
};
/**
 * read a 4 byte identifier
 * return string
 */
rp.readASCII32BE = function () {
	return this.readASCII(4);
};

rp.readASCII = function (len) {
	const offset = this.pos;
	this.pos += len;

	let ret = '';
	for (let i = 0; i < len; i++) {
		ret += String.fromCharCode(this.buf.readUInt8(offset + i));
	}

	return ret;
};

rp.readUnicode = function (len) {
	const offset = this.pos;
	this.pos += len;

	let ret = '';
	for (let i = 0; i < len; i += 2) {
		ret += String.fromCharCode(this.buf.readUInt16BE(offset + i));
	}

	return ret;
};

rp.readUInt32BE = function () {
	const offset = this.pos;
	this.pos += 4;

	return this.buf.readUInt32BE(offset);
};

rp.readInt16BE = function () {
	const offset = this.pos;
	this.pos += 2;

	return this.buf.readInt16BE(offset);
};
rp.readUInt16BE = function () {
	const offset = this.pos;
	this.pos += 2;

	return this.buf.readUInt16BE(offset);
};

rp.readInt8 = function () {
	const offset = this.pos;
	this.pos += 1;

	return this.buf.readInt8(offset);
};
rp.readUInt8 = function () {
	const offset = this.pos;
	this.pos += 1;

	return this.buf.readUInt8(offset);
};

rp.readLong64BE = function () {
	const offset = this.pos;
	this.pos += 8;

	return this.buf.toString('hex', offset, offset + 8);
};

rp.copy = function () {
	return new Reader(this.buf, this.pos);
};

rp.at = function (newPos) {
	return new Reader(this.buf, newPos);
};

function from(buf) {
	return new Reader(Buffer.from(buf), 0);
}

module.exports = Reader;
module.exports.from = from;
