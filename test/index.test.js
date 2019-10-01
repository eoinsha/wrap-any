'use strict';

const {test} = require('tap');

const wrapAny = require('..');

test('A succesfull callback is wrapped as a successful callback', t => {
  const store = {};

  const callbackResult = 'This is the result';

  function testFn(param1, param2, callback) {
    store.testFnArgs = {param1, param2, callback};
    setTimeout(() => callback(null, callbackResult), 0);
  }

  const wrapped = wrapAny(testFn);
  const result = wrapped('a', 'b', (err, data) => {
    t.match(store.testFnArgs, {param1: 'a', param2: 'b'});
    t.notOk(err);
    t.equal(data, callbackResult);
    t.end();
  });
  t.notOk(result);
});

test('A failed callback is wrapped as a failed callback', t => {
  const store = {};

  const callbackErr = new Error('This went badly');

  function testFn(param1, param2, callback) {
    store.testFnArgs = {param1, param2, callback};
    setTimeout(() => callback(callbackErr), 0);
  }

  const wrapped = wrapAny(testFn);
  const result = wrapped('a', 'b', (err, data) => {
    t.match(store.testFnArgs, {param1: 'a', param2: 'b'});
    t.equal(err, callbackErr);
    t.notOk(data);
    t.end();
  });

  t.notOk(result);
});
