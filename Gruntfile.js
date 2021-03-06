/*
 * grunt-cf-compiler
 * https://github.com/eklingen88/grunt-cf-compiler
 *
 * Copyright (c) 2019 Eric M. Klingensmith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    cf_compiler: {
      null_stack: {
        options: {
          outputFormat: 'yaml'
        },
        files: [{
          src: 'test/fixtures/null-stack.yaml',
          dest: 'tmp/null-stack.yaml'
        }]
      },
      nested_null_stack: {
        options: {
          outputFormat: 'yaml'
        },
        files: [{
          src: 'test/fixtures/nested-null-stack.yaml',
          dest: 'tmp/nested-null-stack.yaml'
        }]
      },
      load_balancers: {
        options: {
          outputFormat: 'yaml'
        },
        files: [{
          src: 'test/fixtures/load-balancers.yaml',
          dest: 'tmp/load-balancers.yaml'
        }]
      },
      network_infrastructure: {
        options: {
          outputFormat: 'yaml'
        },
        files: [{
          src: 'test/fixtures/network-infrastructure.yaml',
          dest: 'tmp/network-infrastructure.yaml'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'cf_compiler', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
