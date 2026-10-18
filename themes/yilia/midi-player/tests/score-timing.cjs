const assert = require('node:assert/strict');
const {scoreTiming} = require('../src/score-timing.cjs');
const at = scoreTiming([
  {tstamp: 0, on: ['a', 'b']},
  {tstamp: 20, off: ['a'], on: ['c']},
  {tstamp: 40, off: ['b', 'c']},
  {tstamp: 100, on: ['a']},
  {tstamp: 120, off: ['a']}
]);
assert.deepEqual(at(-1), []);
assert.deepEqual(at(0), ['a', 'b']);
assert.deepEqual(at(20), ['b', 'c']);
assert.deepEqual(at(70), []);
assert.deepEqual(at(110), ['a']);
assert.deepEqual(at(10), ['a', 'b']); // backward seek
assert.deepEqual(at(120), []);
assert.deepEqual(scoreTiming([])(0), []);
console.log('Score timing: chords, note boundaries, silence and backward seeks passed.');
