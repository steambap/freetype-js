const names = [
	'copyright',
	'fontFamilyName',
	'fontSubfamilyName',
	'uniqueFontId',
	'fullFontName',
	'version',
	'postscriptName',
	'trademark',
	'manufacturerName',
	'designer',
	'description',
	'URLVendor',
	'URLDesigner',
	'licenseDescription',
	'licenseInfoURL',
	'reserved',
	'typoFamilyName',
	'typoSubfamilyName',
	'compatibleFull',
	'sampleText',
	'postscriptCIDName',
	'WWSFamilyName',
	'WWSSubfamilyName',
	'lightBackgroundPalette',
	'darkBackgroundPalette'
];

const platforms = [
	'Unicode',
	'Macintosh',
	'ISO',
	'Windows',
	'Custom'
];

module.exports = function (reader) {
	const ret = {};
	ret.format = reader.readUInt16BE();
	const count = ret.count = reader.readUInt16BE();
	ret.stringOffset = reader.readUInt16BE();

	const start = reader.pos + count * 12;

	for (let i = 0; i < count; i++) {
		const platformID = reader.readUInt16BE();
		const encodingID = reader.readUInt16BE();
		const languageID = reader.readUInt16BE();
		const nameID = reader.readUInt16BE();
		const length = reader.readUInt16BE();
		const offset = reader.readUInt16BE();

		const pid = platforms[platformID];
		if (ret[pid] == null) {
			ret[pid] = {};
		}
		const nameReader = reader.at(start + offset);
		let nameStr = '';
		if (platformID === 0) nameStr = nameReader.readUnicode(length);
		else if (platformID === 3 && encodingID === 0) nameStr = nameReader.readUnicode(length);
		else if (encodingID === 0) nameStr = nameReader.readASCII(length);
		else if (encodingID === 1) nameStr = nameReader.readUnicode(length);
		else if (encodingID === 3) nameStr = nameReader.readUnicode(length);
		else if (encodingID === 1) nameStr = nameReader.readASCII(length);
		else throw new Error('Unknow platform and encoding:' + platformID + '-' + encodingID);

		ret[pid][names[nameID]] = nameStr;
	}

	return ret;
};
