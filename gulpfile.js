/**
 * Created by thzo on 19.08.16.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
gulp.task('compress', function (cb) {
  pump([
      gulp.src('app/scripts/components/passwordStrengthChecker.js'),
      uglify(),
      gulp.dest('dist')
    ],
    cb
  );
});
