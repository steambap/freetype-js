const Reader = require('../reader');

module.exports = function (reader, length, state) {
	const ret = {advancingWith: [], lsb: []};
	const numberOfHMetrics = state.hhea.numberOfHMetrics;

	for (let i = 0; i < numberOfHMetrics; i++) {
		ret.advancingWith.push(reader.readUInt16BE());
		ret.lsb.push(reader.readInt16BE());
	}
	return ret;
};
