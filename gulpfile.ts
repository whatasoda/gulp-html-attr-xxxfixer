import gulp       = require('gulp')
import attrFixer  = require('./index')

const fixer = attrFixer([ { attrName: 'href', prefix: '/test' } ])

gulp.task('default', () =>
  gulp.src('test/src/index.html')
    .pipe(fixer)
    .pipe(gulp.dest('test/result'))
)
