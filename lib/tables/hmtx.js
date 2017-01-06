const Reader = require('../reader');

module.exports = function (reader, length) {
	return {reader: reader.slice(length)};
};
