const fs = require('fs');
const path = require('path');
const parse = require('../lib');

const fileContent = fs.readFileSync(path.resolve(__dirname, './NotoMono-Regular.ttf'));

console.log(parse(fileContent));
