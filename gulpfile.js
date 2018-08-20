const gulp = require('gulp');
const path = require('path');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const {babel: babelConf} = require('./package.json');

gulp.task('default', ['babel', 'webpack']);

gulp.task('babel', () =>
    gulp
        .src(['./src/**/*.js', '!./src/**/*.test.js'])
        .pipe(babel(babelConf))
        .pipe(gulp.dest('dist'))
);

gulp.task('webpack', () =>
    gulp
        .src('./tools/example-init.js')
        .pipe(
            webpack({
                entry: './tools/example-init.js',
                output: {
                    filename: 'init.js'
                },
                stats: {
                    warnings: false
                }
            })
        )
        .pipe(gulp.dest('examples'))
);

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['default']);
});
