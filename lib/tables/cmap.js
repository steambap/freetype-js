function parse0(reader) {
	const ret = {map: []};
	ret.format = 0;
	const length = reader.readUInt16BE();
	ret.language = reader.readUInt16BE();
	for (let i = 0; i < length - 6; i++) {
		ret.map.push(reader.readUInt8());
	}

	return ret;
}

function parse4(reader) {
	const start = reader.pos;
	const ret = {endCount: [], startCount: [],
		idDelta: [], idRangeOffset: [], glyphIdArray: []};

	ret.format = reader.readUInt16BE();
	const length = reader.readUInt16BE();
	ret.language = reader.readUInt16BE();
	ret.segCountX2 = reader.readUInt16BE();
	const segCount = ret.segCountX2 / 2;
	ret.searchRange = reader.readUInt16BE();
	ret.entrySelector = reader.readUInt16BE();
	ret.rangeShift = reader.readUInt16BE();
	for (let i = 0; i < segCount; i++) {
		ret.endCount.push(reader.readUInt16BE());
	}
	ret.reservedPad = reader.readUInt16BE();
	for (let i = 0; i < segCount; i++) {
		ret.startCount.push(reader.readUInt16BE());
	}
	for (let i = 0; i < segCount; i++) {
		ret.idDelta.push(reader.readInt16BE());
	}
	for (let i = 0; i < segCount; i++) {
		ret.idRangeOffset.push(reader.readUInt16BE());
	}
	while (reader.pos < start + length) {
		ret.glyphIdArray.push(reader.readUInt16BE());
	}

	return ret;
}

function parse6(reader) {
	const ret = {glyphIdArray: []};
	ret.format = reader.readInt16BE();
	ret.length = reader.readUInt16BE();
	ret.language = reader.readUInt16BE();
	ret.firstCode = reader.readUInt16BE();
	const entryCount = reader.readUInt16BE();
	for (let i = 0; i < entryCount; i++) {
		ret.glyphIdArray.push(reader.readUInt16BE());
	}

	return ret;
}

function parse12(reader) {
	const ret = {groups: []};
	ret.format = reader.readUInt16BE();
	ret.reserved = reader.readUInt16BE();
	ret.length = reader.readUInt32BE();
	ret.language = reader.readUInt32BE();
	const nGroups = reader.readUInt32BE();

	for (let i = 0; i < nGroups; i++) {
		const startCharCode = reader.readUInt32BE();
		const endCharCode = reader.readUInt32BE();
		const startGlyphID = reader.readUInt32BE();
		ret.groups.push([startCharCode, endCharCode, startGlyphID]);
	}

	return ret;
}

function parseSubtable(reader) {
	const format = reader.readUInt16BE();

	switch (format) {
		case 0:
			return parse0(reader.copy());
		case 2:
			throw new Error('High-byte mapping through table parsing is not implemented');
		case 4:
			return parse4(reader.copy());
		case 6:
			return parse6(reader.copy());
		case 8:
			throw new Error('Mixed 16-bit and 32-bit coverage parsing is not implemented');
		case 10:
			throw new Error('Trimmed array parsing is not implemented');
		case 12:
			return parse12(reader.copy());

		default:
			throw new Error('Unknown format: ' + format);
	}
}

module.exports = function (reader) {
	const start = reader.pos;
	const ret = {tables: []};

	ret.version = reader.readUInt16BE();
	const numTables = ret.numTables = reader.readUInt16BE();

	const offsetList = [];
	for (let i = 0; i < numTables; i++) {
		const platformID = reader.readUInt16BE();
		const encodingID = reader.readUInt16BE();
		const tableOffset = reader.readUInt32BE() + start;

		const id = 'p' + platformID + 'e' + encodingID;

		let tableIndex = offsetList.indexOf(tableOffset);

		if (tableIndex === -1) {
			tableIndex = ret.tables.length;
			ret.tables.push(parseSubtable(reader.at(tableOffset)));
		}

		if (ret[id]) {
			throw new Error('Multiple tables for one platform+encoding');
		}
		ret[id] = tableIndex;
	}

	return ret;
};
