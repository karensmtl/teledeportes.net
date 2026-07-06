// Smoke test — proves the test runner boots. Replace with real coverage as
// TSS 07 graduates from Draft to 1.0.
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('environment is sane', () => {
    assert.equal(typeof process.version, 'string');
});
