/*
 * Grunt Task File
 * ---------------
 *
 * Task: Stylus 
 * Description: Compiles Stylus files into CSS
 * Dependencies: None
 *
 */
var stylus = require('stylus')
  , nib = require('nib')
  , _ = require('lodash')
  , async = require('async');

module.exports = function(grunt) {

  var config = grunt.config;
  var file = grunt.file;
  var log = grunt.log;

  function exeStylus(src, options, fn) {
    var s = stylus(src)
        .define('url', stylus.url({ paths: [__dirname + '/../client/assets/a/b'] }))
        .use(nib())
        .import('nib');

    _.each(options, function(value, key) {
      s.set(key, value);
    });

    s.render(function(err, css) {
      if (err) {
        log.error(err);
      }
      fn(err, css);
    });
  }

  // Compiles Jade templates into HTML. Each input file is renamed with a '.html'
  // extension. The task name specifies the output directory. Options are
  // specified via 'jadeopts'.
  grunt.registerMultiTask('stylus', 'Compile Stylus files into a single CSS file.', function() {
    var self = this;

    var done = this.async();

    var options = config('stylusopts') || {};
    grunt.verbose.writeflags(options, 'Options');

    if (!_.isArray(this.data)) {
      this.target = _.keys(this.data)[0];
      this.data = this.data[this.target];
    }

    async.concat(file.expand(this.data), function(filepath, fn) {
      grunt.verbose.writeln('Compiling ' + filepath);
      var opts = _.extend(options, {filename: filepath});
      exeStylus(file.read(filepath), opts, function(err, css) {
        fn(err, css);
      });
    }, function(err, css) {
      if (!err) {
        file.write(self.target, css.join('\n'));
        log.writeln('File "' + self.target + '" created.');
      }
      done(err);
    });
  });

};
