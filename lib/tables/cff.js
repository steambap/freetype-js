function parseIndex(reader) {
	const start = reader.pos;
	const data = [];
	const count = reader.readUIn16BE();

	if (count > 0) {
		const offsize = reader.readUInt8();
		if (offsize < 1 || offsize > 4) {
			throw new Error('Invalid cff NAME INDEX offsize: ', offsize);
		}
		for (let i = 0; i < count + 1; i++) {
			data.push(reader.readIntBE(offsize));
		}
	}

	return data;
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
		// names.push(reader.)
	}

	return ret;
};
