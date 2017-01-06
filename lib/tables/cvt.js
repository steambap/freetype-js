module.exports = function (reader, length) {
	const start = reader.pos;
	const valueList = [];
	while (reader.pos - start < length) {
		valueList.push(reader.readInt16BE());
	}

	return valueList;
};
