'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.cf_compiler = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  null_stack: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/null-stack.yaml');
    var expected = grunt.file.read('test/expected/null-stack.yaml');
    test.equal(actual, expected);

    test.done();
  },
  nested_null_stack: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/nested-null-stack.yaml');
    var expected = grunt.file.read('test/expected/nested-null-stack.yaml');
    test.equal(actual, expected);

    test.done();
  },
  load_balancers: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/load-balancers.yaml');
    var expected = grunt.file.read('test/expected/load-balancers.yaml');
    test.equal(actual, expected);

    test.done();
  },
  network_infrastructure: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/network-infrastructure.yaml');
    var expected = grunt.file.read('test/expected/network-infrastructure.yaml');
    test.equal(actual, expected);

    test.done();
  },
};
