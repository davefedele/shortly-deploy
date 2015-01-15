module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      // options: {
      //         separator: ';'
      //       },
      //       js: {
      //         src: ['public/client/**/*.js'],
      //         dest: 'public/dist/<%= pkg.name %>.js'
      //       },
      //       vendor: {
      //         src: ['public/lib/jquery.js', 'public/lib/underscore.js', 'public/lib/**/*.js'],
      //         dest: 'public/dist/vendors.js'
      //       }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files:{
          'public/dist/clientapp.min.js' : [
            'public/client/app.js',
            'public/client/link.js',
            'public/client/links.js',
            'public/client/linkView.js',
            'public/client/linksView.js',
            'public/client/createLinkView.js',
            'public/client/router.js'
          ],
            'public/dist/vendor.min.js' : [
              'public/lib/jquery.js',
              'public/lib/underscore.js',
              'public/lib/backbone.js',
              'public/lib/handlebars.js'
          ]
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/*.js',
        'app/config.js',
        'app/**/*.js',
        'lib/*.js',
        'public/dist/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      minify: {
        src: 'public/style.css',
        dest: 'public/dist/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        options: {
            stdout: true
        },
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'uglify',
    'jshint',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([ 'shell:prodServer' ]);
      // git push azure master;
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'build',
    'test',
    'upload'
  ]);


};
