export class Font {
	ascender: number;
	descender: number;
	unitsPerEm: number;
	charToGlyph(c: string): Glyph;
	stringToGlyphs(s: string): Glyph[];
}

export class Glyph {
	name: string
	advanceWidth: number;
	getPathData(x: number, y:number, fontSize: number): string;
	getSVG(x: number, y:number, fontSize: number): string;
}

export function loadSync(url: string): Font;
