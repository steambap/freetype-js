function parse0(data, offset) {
	const ret = {map: []};
	ret.format = data.readUInt16BE(offset);
	offset += 2;
	const length = data.readUInt16BE(offset);
	offset += 2;
	ret.language = data.readUInt16BE(offset);
	offset += 2;
	for (let i = 0; i < length - 6; i++) {
		ret.map.push(data.readUInt8(offset + i));
	}

	return obj;
}

function parse4(data, offset) {
	const start = offset;
	const ret = {endCount: [], startCount: [],
		idDelta: [], idRangeOffset: [], glyphIdArray: []};

	ret.format = data.readUInt16BE(offset);
	offset += 2;
	const length = data.readUInt16BE(offset);
	offset += 2;
	ret.language = data.readUInt16BE(offset);
	offset += 2;
	ret.segCountX2 = data.readUInt16BE(offset);
	offset += 2;
	const segCount = ret.segCountX2 / 2;
	ret.searchRange = data.readUInt16BE(offset);
	offset += 2;
	ret.entrySelector = data.readUInt16BE(offset);
	offset += 2;
	ret.rangeShift = data.readUInt16BE(offset);
	offset += 2;
	for (let i = 0; i < segCount; i++) {
		ret.endCount.push(data.readUInt16BE(offset));
		offset += 2;
	}
	ret.reservedPad = data.readUInt16BE(offset);
	offset += 2;
	for (let i = 0; i < segCount; i++) {
		ret.startCount.push(data.readUInt16BE(offset));
		offset += 2;
	}
	for (let i = 0; i < segCount; i++) {
		ret.idDelta.push(data.readInt16BE(offset));
		offset += 2;
	}
	for (let i = 0; i < segCount; i++) {
		ret.idRangeOffset.push(data.readUInt16BE(offset));
		offset += 2;
	}
	while (offset < start + length) {
		ret.glyphIdArray.push(data.readUInt16BE(offset));
		offset += 2;
	}

	return ret;
}

function parse6(data, offset) {
	const ret = {glyphIdArray: []};
	ret.format = data.readInt16BE(offset);
	offset += 2;
	ret.length = data.readUInt16BE(offset);
	offset += 2;
	ret.language = data.readUInt16BE(offset);
	offset += 2;
	ret.firstCode = data.readUInt16BE(offset);
	offset += 2;
	const entryCount = data.readUInt16BE(offset);
	offset += 2;
	for (let i = 0; i < entryCount; i++) {
		ret.glyphIdArray.push(data.readUInt16BE(offset));
		offset += 2;
	}

	return ret;
}

function parse12(data, offset) {
	const ret = {groups: []};
	ret.format = data.readUInt16BE(offset);
	offset += 2;
	ret.reserved = data.readUInt16BE(offset);
	offset += 2;
	ret.length = data.readUInt32BE(offset);
	offset += 4;
	ret.language = data.readUInt32BE(offset);
	offset += 4;
	const nGroups = data.readUInt32BE(offset);
	offset += 4;

	for (let i = 0; i < nGroups; i++) {
		const groupOffset = offset + i * 12;
		const startCharCode = data.readUInt32BE(groupOffset);
		const endCharCode = data.readUInt32BE(groupOffset + 4);
		const startGlyphID = data.readUInt32BE(groupOffset + 8);
		ret.groups.push([startCharCode, endCharCode, startGlyphID]);
	}

	return ret;
}

function parseSubtable(data, offset) {
	const format = data.readUInt16BE(offset);

	switch (format) {
		case 0:
			return parse0(data, offset);
		case 2:
			throw new Error('High-byte mapping through table parsing is not implemented');
		case 4:
			return parse4(data, offset);
		case 6:
			return parse6(data, offset);
		case 12:
			return parse12(data, offset);
	
		default:
			throw new Error('Unknown format: ' + format);
	}
}

module.exports = function (data, offset, length) {
	const start = offset;
	const version = data.readUInt16BE(offset);
	offset += 2;
	const numTables = data.readUInt16BE(offset);
	offset += 2;

	const obj = {tables: []};
	const offsetList = [];
	for (let i = 0; i < numTables; i++) {
		const platformID = data.readUInt16BE(offset);
		offset += 2;
		const encodingID = data.readUInt16BE(offset);
		offset += 2;
		const tableOffset = data.readUInt32BE(offset) + start;
		offset += 4;

		const id = 'p' + platformID + 'e' + encodingID;

		let tableIndex = offsetList.indexOf(tableOffset);

		if (tableIndex === -1) {
			tableIndex = obj.tables.length;
			obj.tables.push(parseSubtable(data, tableOffset));
		}

		if (obj[id] != null) {
			throw new Error('Multiple tables for one platform+encoding');
		}
		obj[id] = tableIndex;
	}

	return obj;
};
