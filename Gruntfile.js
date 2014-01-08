'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch:{
      mocha: {
        // files: ['<%= yeoman.app %>/scripts/main.js'],
        files: ['test/{,*/}*.js', 'backbone-idb.js'],
        tasks: ['mocha']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '{,.tmp/}test/{,*/}*.js',
          'backbone-idb.js'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35730,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            'test',
            'node_modules'
          ]
        }
      },
      test: {
        options: {
          port: 9000,
          livereload: 35730,
          hostname: 'localhost',
          open: true,
          base: [
            'test',
            'node_modules',
            './'
          ]
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        // 'backbone-idb.js',
        'test/{,*/}*.js'
      ]
    },
    mocha: {
      all: {
        // src: 'test/index.html',
        options: {
          run: true,
          reporter: 'Spec',
          log: true,
          bail: false,
          mocha: {
            ignoreLeaks: true
          },
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/test/index.html']
        }
      }
    },
    concurrent: {
      test: [
        'mocha'
      ],
      dist: [
        'clean:dist'
      ]
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'connect:test',
    'mocha',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concurrent:dist'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};