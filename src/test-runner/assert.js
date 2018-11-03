const {AssertionError} = require('assert');

const assert = {};

/**
 * @param {boolean} condition .
 * @param {string=} message .
 */
assert.ok = function (condition, message) {
    if (!condition) {
        throw new AssertionError({
            message: message,
            actual: false,
            expected: true,
            operator: 'ok'
        });
    }
};

assert.fail = function (message) {
    throw new AssertionError({
        message: message,
        actual: null,
        expected: null,
        operator: 'fail'
    });
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.equal = function (actual, expected, message) {
    /* eslint-disable-next-line eqeqeq */
    if (!(actual == expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '=='
        });
    }
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.strictEqual = function (actual, expected, message) {
    if (!(actual === expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '==='
        });
    }
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.greater = function (actual, expected, message) {
    if (!(actual > expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '>'
        });
    }
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.greaterOrEqual = function (actual, expected, message) {
    if (!(actual >= expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '>='
        });
    }
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.less = function (actual, expected, message) {
    if (!(actual < expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '<'
        });
    }
};

/**
 * @param {number} actual .
 * @param {number} expected .
 * @param {string=} message .
 */
assert.lessOrEqual = function (actual, expected, message) {
    if (!(actual <= expected)) {
        throw new AssertionError({
            message: message,
            actual: actual,
            expected: expected,
            operator: '<='
        });
    }
};

module.exports = {
    AssertionError,
    assert
};
