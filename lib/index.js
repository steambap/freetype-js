const tags = [
  'OS/2'
];

function parse(buf) {
  const data = Buffer.from(buf);
  let offset = 0;

  const sfntVersion = data.readUInt32BE(0);
  const numTables = data.readUInt16BE(4);
  const searchRange = data.readUInt16BE(6);
  const entrySelector = data.readUInt16BE(8);
  const rangeShift = data.readUInt16BE(10);

  
}