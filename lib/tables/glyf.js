function loadGlyphHeader (reader) {
	const header = {};
	header.numOfContours = reader.readInt16BE();
	header.xMin = reader.readInt16BE();
	header.yMin = reader.readInt16BE();
	header.xMax = reader.readInt16BE();
	header.yMax = reader.readInt16BE();

	return header;
}

function loadSimpleGlyph (reader, header) {
	const data = {endPts: [], instructions: [], flags: [], xs: [], ys: []};

	for (let i = 0; i < header.numOfContours; i++) {
		data.endPts.push(reader.readUInt16BE());
	}
	const insLen = data.instructionLength = reader.readUInt16BE();
	for (let i = 0; i < insLen; i++) {
		data.instructions.push(reader.readUInt8());
	}
	const endPoints = data.endPts[header.numOfContours - 1] + 1;
	for (let i = 0; i < endPoints; i++) {
		const flag = reader.readUInt8();
		data.flags.push(flag);
		// the flag is repeat
		if (flag & 8) {
			const repeat = reader.readUInt8();
			for (let j = 0; j < repeat; j++) {
				data.flags.push(flag);
				i++;
			}
		}
	}

	let absoluteX = 0;
	for (let i = 0; i < endPoints; i++) {
		const flag = data.flags[i];
		let x = 0;
		// x short vector flag is set
		if (flag & 2) {
			x = reader.readUInt8();
			// x is same flag
			if (flag & 16) {
				x = -x;
			}
		} else {
			x = reader.readInt16BE();
		}
		absoluteX += x;

		data.xs.push(absoluteX);
	}

	let absoluteY = 0;
	for (let i = 0; i < endPoints; i++) {
		const flag = data.flags[i];
		let y = 0;
		// y short vector flag is set
		if (flag & 4) {
			y = reader.readUInt8();
			// y is same flag
			if (flag & 32) {
				y = -y;
			}
		} else {
			y = reader.readInt16BE();
		}
		absoluteY += y;

		data.ys.push(absoluteY);
	}

	return data;
}

const ARG_1_AND_2_ARE_WORDS = 1 << 0;
const ARGS_ARE_XY_VALUES = 1 << 1;
const ROUND_XY_TO_GRID = 1 << 2;
const WE_HAVE_A_SCALE = 1 << 3;
const RESERVED = 1 << 4;
const MORE_COMPONENTS = 1 << 5;
const WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
const WE_HAVE_A_TWO_BY_TWO = 1 << 7;
const WE_HAVE_INSTRUCTIONS = 1 << 8;
const USE_MY_METRICS = 1 << 9;
const OVERLAP_COMPOUND = 1 << 10;
const SCALED_COMPONENT_OFFSET = 1 << 11;
const UNSCALED_COMPONENT_OFFSET = 1 << 12;

function loadComplexGlyph (reader) {
	const data = {};

	let flags;
	let arg1;
	let arg2;
	do {
		flags = reader.readUInt16BE();
		const part = {};
		part.glyphIndex = reader.readUInt16BE();
		if (flags & ARG_1_AND_2_ARE_WORDS) {
			arg1 = reader.readInt16BE();
			arg2 = reader.readInt16BE();
		} else {
			arg1 = reader.readUInt8();
			arg2 = reader.readUInt8();
		}

		if (flags & ARGS_ARE_XY_VALUES) {
			part.tx = arg1;
			part.ty = arg2;
		} else {
			part.p1 = arg1;
			part.p2 = arg2;
		}

		if (flags & WE_HAVE_A_SCALE) {
			part.a = part.d = reader.readF2dot14();
		} else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
			part.a = reader.readF2dot14();
			part.d = reader.readF2dot14();
		} else if (flags & WE_HAVE_A_TWO_BY_TWO) {
			part.a = reader.readF2dot14();
			part.b = reader.readF2dot14();
			part.c = reader.readF2dot14();
			part.d = reader.readF2dot14();
		}
	} while (flags & MORE_COMPONENTS)

	if (flags & WE_HAVE_INSTRUCTIONS) {
		const numInstr = reader.readUInt16BE();
		data.instr = [];
		for (let i = 0; i < numInstr; i++) {
			data.instr.push(reader.readUInt8());
		}
	}

	return data;
}

function readGlyph (reader) {
	const header = loadGlyphHeader(reader);

	const glyphData = header.numOfContours > 0 ?
		loadSimpleGlyph(reader, header) : loadComplexGlyph(reader);

	return Object.assign(header, glyphData);
}

module.exports = function (reader, length, state) {
	const start = reader.pos;
	const glyphList = [];
	const offsetList = state.loca;
	const numOfGlyphs = state.maxp.numOfGlyphs;

	for (let glyphIndex = 0; glyphIndex < numOfGlyphs; glyphIndex++) {
		const cursor = start + offsetList[glyphIndex];

		if (offsetList[glyphIndex] = offsetList[glyphIndex + 1]) {
			glyphList.push(null);
		} else {
			glyphList.push(readGlyph(reader.at(cursor)));
		}
	}

	return glyphList;
};
