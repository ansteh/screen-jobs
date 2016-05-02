'use strict';
var gulp        = require('gulp');
var del         = require('del');
var svgSprite   = require('gulp-svg-sprite');

let paths = {};

paths.sprite = {
  filename:   '',
  dest:       'client/icons/sets',
  src:        [
      'bower_components/material-design-icons/editor/svg/design/ic_title_24px.svg',
      'bower_components/material-design-icons/communication/svg/design/ic_business_24px.svg',
  ]
};

let svgSpriteConfig = {
  mode: {
    //dest: 'icons',
    sprite: paths.sprite.filename,
    css: {
      bust: false,
      render: {
        css: false
      }
    }
  }
};

gulp.task('cleanSprite', function(cb) {
  del(['www/img/icons/sets']).then(function(){ cb(); });
});

gulp.task('sprite', ['cleanSprite'], function() {
  return gulp.src(paths.sprite.src)
      .pipe(svgSprite(svgSpriteConfig))
      .pipe(gulp.dest(paths.sprite.dest));
});
