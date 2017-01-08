function parseIndex(reader) {
	const count = reader.readUInt16BE();

	if (count === 0) {
		return [];
	}

	const offsize = reader.readUInt8();
	if (offsize < 1 || offsize > 4) {
		throw new Error('Invalid cff NAME INDEX offsize: ', offsize);
	}
	const ret = [];

	for (let i = 0; i < count + 1; i++) {
		ret.push(reader.readIntBE(offsize));
	}

	reader.pos = reader.pos - 1;

	return ret;
}

function getSubrs() {

}

function getDict(reader, end) {
	const dict = {};
	const carr = [];

	while (reader.pos < end) {
		const b0 = reader.readUInt8();
		if (b0 <= 21) {
			if (b0 === 12) {

			}
		}
	}
}

module.exports = function (reader) {
	const start = reader.pos;
	const ret = {};
	ret.major = reader.readUInt8();
	ret.minor = reader.readUInt8();
	ret.hdrSize = reader.readUInt8();
	ret.offsize = reader.readUInt8();

	const nameIndex = parseIndex(reader);
	const names = [];
	for (let i = 0; i < nameIndex.length - 1; i++) {
		const offset0 = nameIndex[i];
		const offset1 = nameIndex[i + 1];
		names.push(reader.at(reader.pos + offset0).readASCII(offset1 - offset0));
	}
	reader = reader.at(nameIndex[nameIndex.length - 1]);

	const topIndex = parseIndex(reader);
	const topDicts = [];
	for (let i = 0; i < topIndex.length - 1; i++) {
		
	}

	return ret;
};
