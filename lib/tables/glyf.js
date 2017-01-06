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

function loadComplexGlyph (reader) {
	const data = {};

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
