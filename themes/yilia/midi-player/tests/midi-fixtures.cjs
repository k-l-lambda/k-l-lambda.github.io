function vlq(n) {
  const result = [n & 127];
  while ((n >>= 7)) result.unshift((n & 127) | 128);
  return result;
}
function midi(tracks, division = 480) {
  const header = Buffer.alloc(14);
  header.write('MThd'); header.writeUInt32BE(6, 4); header.writeUInt16BE(tracks.length > 1 ? 1 : 0, 8);
  header.writeUInt16BE(tracks.length, 10); header.writeUInt16BE(division, 12);
  return Buffer.concat([header, ...tracks.map(events => {
    const data = Buffer.from(events.flat());
    const chunk = Buffer.alloc(8); chunk.write('MTrk'); chunk.writeUInt32BE(data.length, 4);
    return Buffer.concat([chunk, data]);
  })]);
}
function example() {
  const events = [[0, 0xff, 0x51, 3, 7, 0xa1, 0x20], [0, 0xc0, 0]];
  for (const pitch of [60, 64, 67, 72, 71, 67, 64, 60])
    events.push([0, 0x90, pitch, 80], [...vlq(480), 0x80, pitch, 0]);
  events.push([...vlq(480), 0xff, 0x2f, 0]);
  return midi([events]);
}
module.exports = {vlq, midi, example};
