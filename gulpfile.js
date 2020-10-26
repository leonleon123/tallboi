const gulp = require('gulp')
const ts = require('gulp-typescript')
const browserSync = require('browser-sync').create()
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')

const tsProject = ts.createProject('tsconfig.json')

gulp.task('compile', function() {
    return gulp.src('src/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'))
})

gulp.task('browserify', function() {
    return browserify('dist/index.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('dist'))
})

gulp.task('uglify', function(){
    return gulp.src('dist/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

gulp.task('start', function(){
    browserSync.init({
        server: {
            baseDir: './',
        }
    })
    gulp.watch('src/*.ts', gulp.series('compile', 'browserify', 'uglify'))
    gulp.watch('dist/*.js').on('change', browserSync.reload)
    gulp.watch('index.html').on('change', browserSync.reload)
    gulp.watch('css/*.css').on('change', browserSync.reload)
})

gulp.task('build', gulp.series('compile', 'browserify', 'uglify'))