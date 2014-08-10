'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'server/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "JST",
          amd:"handlebars",
          processName: function(filePath) {
             return filePath.replace(/^server\/views\//, '').replace(/\.hbs$/, '');
          }
        },
      files: {
        'public/templates/templates.js': 'server/views/**/*.hbs', //模板文件
        //expand: 'true',
        //cwd: 'node_modules/handlebars',
        //src: 'server/views/**/*.hbs', //模板文件
        //dest: 'public/templates/', //编译后的文件存放位置
        //ext: '.js' //编译后的文件格式         
      }
    }
   },
   uglify: {
    options: {
      mangle: false
    },
    my_target: {
      files: {
        'public/builderjs/mehrklib.js': ['public/js/lib/lodash.min.js','public/js/lib/knockout-3.1.0.js','public/js/lib/knockout.validation.min.js','public/js/require.js','public/js/lib/handlebars.runtime-v1.3.0.js']
      }
    }
  },
   requirejs: {
     compile: {
       options: {
        mainConfigFile:'public/js/builder.js', 
        optimize: 'uglify',
        name: "main", // assumes a production build using main
        out: "public/builderjs/mehrkmodule.js",
        exclude: ['knockout','jquery','bootstrap','knockout.validation','lodash','handlebars']
     }
    }
   },
   mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      html:{
        files:['server/views/**/*.hbs'],
        tasks: ['handlebars']
      },
      js:{
        files:['server/**/*.js','public/**/*.js'],
        tasks: ['jshint']
      },
      test:{
        files:['test/**/*.js'],
        tasks: ['mochaTest']
      },
      livereload:{  
        options:{  
            livereload:true
        },  
        files:[ 'Gruntfile.js', 'server/**/*.*']  
      }  
    }
  });

  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('default', ['jshint','uglify','handlebars','requirejs', 'watch']);
};
