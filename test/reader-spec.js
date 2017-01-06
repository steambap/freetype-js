const assert = require('assert');
const Reader = require('../lib/reader');

const is = assert.equal;

describe('reader', () => {
	it('read uint 8', () => {
		const reader = Reader.from([1, -2]);
		is(1, reader.readUInt8());
		is(254, reader.readUInt8());
	});

	it('read int 8', () => {
		const reader = Reader.from([-1, 5]);
		is(-1, reader.readInt8());
		is(5, reader.readInt8());
	});

	it('read uint 16', () => {
		const reader = Reader.from([0x12, 0x34, 0x34, 0x56]);
		is('1234', reader.readUInt16BE().toString(16));
		is('3456', reader.readUInt16BE().toString(16));
	});

	it('read int 16', () => {
		const reader = Reader.from([0, 5]);
		is(5, reader.readInt16BE());
	});

	it('read uint 32', () => {
		const reader = Reader.from([0x12, 0x34, 0x56, 0x78]);
		is('12345678', reader.readUInt32BE().toString(16));
	});

	it('read 4 byte identifier', () => {
		const reader = Reader.from('abcd');
		is('abcd', reader.readASCII32BE());
	});

	it('read fixed', () => {
		const reader = Reader.from([0x00, 0x01, 0x00, 0x00]);
		is(1, reader.readFixed32BE());
	});
});
