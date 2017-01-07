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

rp.readFixed32BE = function () {
	const offset = this.pos;
	this.pos += 4;

	const whole = this.buf.readInt16BE(offset);
	const frac = this.buf.readInt16BE(offset + 2) / (256 * 256);

	return whole + frac;
};

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
rp.readF2dot14 = function () {
	return this.readInt16BE() / 0x4000;
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
/**
 * parse long date time
 * apple time in second => unix time stamp
 */
rp.readLong64BE = function () {
	this.readUInt32BE();
	const t = this.readUInt32BE();

	return new Date((t - 2082844800) * 1000).toDateString();
};

rp.readIntBE = function (length) {
	const offset = this.pos;
	this.pos += length;

	return this.buf.readIntBE(offset, length);
};

rp.copy = function () {
	return new Reader(this.buf, this.pos);
};

rp.at = function (newPos) {
	return new Reader(this.buf, newPos);
};

rp.slice = function (length) {
	const start = this.pos;
	const buf = this.buf.slice(start, start + length);

	return new Reader(buf, start);
};

function from(buf) {
	return new Reader(Buffer.from(buf), 0);
}

module.exports = Reader;
module.exports.from = from;
