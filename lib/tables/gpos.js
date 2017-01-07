function parseScriptList(reader) {
	const start = reader.pos;
	const ret = {};
	const count = reader.readUInt16BE();

	for (let i = 0; i < count; i++) {
		const tag = reader.readASCII32BE().trim();
		const offset = reader.readUInt16BE();
		ret[tag] = getScriptTable(reader.at(start + offset));
	}

	return ret;
}

function getScriptTable(reader) {
	const start = reader.pos;
	const ret = {};

	const defLangSysOff = reader.readUInt16BE();
	ret.default = getLangSysTable(reader.at(start + defLangSysOff));

	const langSysCount = reader.readUInt16BE();

	for (let i = 0; i < langSysCount; i++) {
		const tag = reader.readASCII32BE().trim();
		const langSysOff = reader.readUInt16BE();
		ret[tag] = getLangSysTable(reader.at(start + langSysOff));
	}

	return ret;
}

function getLangSysTable(reader) {
	const table = {features: []};
	table.lookupOrder = reader.readUInt16BE();
	table.reqFeature = reader.readUInt16BE();

	const count = reader.readUInt16BE();
	for (let i = 0; i < count; i++) {
		table.features.push(reader.readUInt16BE());
	}

	return table;
}

function parseFeatureList(reader) {
	const start = reader.pos;
	const list = [];
	const count = reader.readUInt16BE();

	for (let i = 0; i < count; i++) {
		const tag = reader.readASCII32BE();
		const offset = reader.readUInt16BE();
		const table = getFeatureTable(reader.at(start + offset));
		list.push({tag, table});
	}

	return list;
}

function getFeatureTable(reader) {
	reader.readUInt16BE();
	const count = reader.readUInt16BE();
	const indices = [];
	for (let i = 0; i < count; i++) {
		indices.push(reader.readUInt16BE());
	}

	return indices;
}

function parseLookupList(reader) {
	const start = reader.pos;
	const list = [];

	const count = reader.readUInt16BE();
	for (let i = 0; i < count; i++) {
		const offset = reader.readUInt16BE();
		list.push(getLookupTable(reader.at(start + offset)));
	}

	return list;
}

function getLookupTable(reader) {
	const start = reader.pos;
	const ret = {start, table: []};
	const type = ret.type = reader.readUInt16BE();
	ret.flag = reader.readUInt16BE();
	const count = reader.readUInt16BE();

	for (let i = 0; i < count; i++) {
		const offset = reader.readUInt16BE();
		if (type === 2) {
			ret.table.push(getPairPosTable(reader.at(start + offset)));
		}
	}

	return ret;
}

function numOfOnes(n) {
	let num = 0;
	for (let i = 0; i < 32; i++) {
		if (n & (1 << i)) {
			num += 1;
		}
	}

	return num;
}

function getPairPosTable(reader) {
	const start = reader.pos;
	const table = {};
	const format = table.format = reader.readUInt16BE();
	const covOffset = reader.readUInt16BE();
	table.coverage = getCoverage(reader.at(start + covOffset));
	const valFmt1 = table.valFmt1 = reader.readUInt16BE();
	const valFmt2 = table.valFmt2 = reader.readUInt16BE();
	const ones1 = numOfOnes(valFmt1);
	const ones2 = numOfOnes(valFmt2);

	if (format === 1) {
		table.pairSets = [];
		const count = reader.readUInt16BE();

		for (let i = 0; i < count; i++) {
			const offset = start + reader.readUInt16BE();
			const arr = parse1Inner(reader.at(offset), {valFmt1, valFmt2, ones1, ones2});
			table.pairSets.push(arr);
		}
	} else if (format === 2) {
		const classDef1 = reader.readUInt16BE();
		const classDef2 = reader.readUInt16BE();
		const count1 = reader.readUInt16BE();
		const count2 = reader.readUInt16BE();

		table.classDef1 = getClassDef(reader.at(start + classDef1));
		table.classDef2 = getClassDef(reader.at(start + classDef2));

		table.matrix = [];
		for (let i = 0; i < count1; i++) {
			const row = [];
			for (let j = 0; j < count2; j++) {
				let val1 = null;
				let val2 = null;
				if (valFmt1) {
					val1 = getValueRecord(reader.copy(), valFmt1);
					reader = reader.at(reader.pos + ones1 * 2);
				}
				if (valFmt2) {
					val2 = getValueRecord(reader.copy(), valFmt2);
				}
				row.push({val1, val2});
			}
			table.matrix.push(row);
		}
	}

	return table;
}

function parse1Inner(reader, props) {
	const arr = [];
	const pvcount = reader.readUInt16BE();
	for (let i = 0; i < pvcount; i++) {
		const gid2 = reader.readUInt16BE();
		let val1;
		let val2;
		if (props.valFmt1) {
			val1 = getValueRecord(reader.copy(), props.valFmt1);
			reader = reader.at(reader.pos + props.ones1 * 2);
		}
		if (props.valFmt2) {
			val2 = getValueRecord(reader.copy(), porps.valFmt2);
		}
		arr.push({gid2, val1, val2});
	}

	return arr;
}

function getClassDef(reader) {
	const ret = {start: [], end: [], class: []};
	const format = reader.readUInt16BE();
	if (format === 1) {
		const startGlyph = reader.readUInt16BE();
		const glyphCount = reader.readUInt16BE();
		for (let i = 0; i < glyphCount; i++) {
			ret.start.push(startGlyph + i);
			ret.end.push(startGlyph + i);
			ret.class.push(reader.readUInt16BE());
		}
	} else if (format === 2) {
		const count = reader.readUInt16BE();
		for (let i = 0; i < count; i++) {
			ret.start.push(reader.readUInt16BE());
			ret.end.push(reader.readUInt16BE());
			ret.class.push(reader.readUInt16BE());
		}
	}

	return ret;
}

function getValueRecord(reader, format) {
	const records = [];
	records.push(format & 1 ? reader.readInt16BE() : 0);
	records.push(format & 2 ? reader.readInt16BE() : 0);
	records.push(format & 4 ? reader.readInt16BE() : 0);
	records.push(format & 8 ? reader.readInt16BE() : 0);

	return records;
}

function getCoverage(reader) {
	const ret = [];
	const format = reader.readUInt16BE();
	const count = reader.readUInt16BE();
	if (format === 1) {
		for (let i = 0; i < count; i++) {
			ret.push(reader.readUInt16BE());
		}
	} else if (format === 2) {
		for (let i = 0; i < count; i++) {
			const start = reader.readUInt16BE();
			const end = reader.readUInt16BE();
			let index = reader.readUInt16BE();

			for (let j = start; j <= end; j++) {
				ret[index++] = j;
			}
		}
	}

	return ret;
}

module.exports = function (reader, length) {
	const start = reader.pos;
	const ret = {start, length};
	ret.tableVersion = reader.readFixed32BE();
	const offScriptList = reader.readUInt16BE();
	const offFeatureList = reader.readUInt16BE();
	const offLookupList = reader.readUInt16BE();

	ret.scriptList = parseScriptList(reader.at(start + offScriptList));
	ret.featureList = parseFeatureList(reader.at(start + offFeatureList));
	ret.lookupList = parseLookupList(reader.at(start + offLookupList));

	return ret;
};
