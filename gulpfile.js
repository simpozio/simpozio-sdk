const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('default', () =>
    gulp
        .src('package.json', {read: false})
        .pipe(shell(["npx babel src -q --out-dir dist --ignore '**/*.test.js'; npx webpack;"], {quiet: true}))
);

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['default']);
});
