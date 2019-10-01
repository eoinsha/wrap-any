'use strict';

function handleError(err) {
  console.log('handleError', err)
}

module.exports = function(fn) {
  return function wrapped() {
    const args = [...arguments];

    let lastArg = args.pop();

    let wrappedCallback;
    if (typeof lastArg === 'function') {
      const origCallback = lastArg;
      lastArg = function callback() {
        const [err, ...rest] = arguments;
        if (err) {
          handleError(err);
        }
        origCallback.apply(this, arguments);
      };
    }
    args.push(lastArg);

    const result = fn.apply(this, args);
    if (result && result.then) {
      return Promise.resolve(
        result.catch(err => {
          return handleError(err);
        }),
      );
    }
    return result;
  };
};
