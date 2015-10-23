var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    fs = require('fs'),
    path = require('path'),
    pkg = require('./package.json'),
    plumber = require('gulp-plumber'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    reload = require('gulp-livereload'),
    imgMin = require('gulp-image'),
    imgResize = require('gulp-responsive-images');

var dirs = pkg['project-config'].directories;
var runSequence = require('run-sequence');
var del = require('del');

// --------------------------------------------------------------------
// | Helper Tasks                                                     |
// --------------------------------------------------------------------

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function getAllFilesFromFolders(dir) {
    var results = [];

    fs.readdirSync(dir).forEach(function(file) {
        file = path.join(dir, file);
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolders(file));
        } else {
            if (file.substring(0, 1) !== '.') {
                results.push(file);
            }
        }
    });

    return results;
}

gulp.task('clean', function(done) {
    return del([
        dirs.dist,
        dirs.archive
    ]);
});

gulp.task('copy', [
    'copy:html',
    'copy:misc'
]);

// JavaScript Related tasks
var onError = function(err) {
    console.log(err.message);
};

gulp.task('lint:js', function() {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/js/*.js',
        dirs.src + '/views/js/*.js'
    ]).pipe(plumber({
        errorHandler: onError
    })).pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(reload());
});

gulp.task('minify:js', ['lint:js'],  function() {
    var files = [];
    files = files.concat(getAllFilesFromFolders(dirs.src + '/js'));
    files = files.concat(getAllFilesFromFolders(dirs.src + '/views/js'));

    var streams = files.map(function(file) {
        gulp.src(file)
            .pipe(uglify())
            .pipe(gulp.dest(dirs.dist + file.replace(/^(?:src)/, '').replace(/[^\/]*$/, '')));
    });

});

gulp.task('minify:css', ['clean'], function() {
    var files = [];
    files = files.concat(getAllFilesFromFolders(dirs.src + '/css'));
    files = files.concat(getAllFilesFromFolders(dirs.src + '/views/css'));

    var streams = files.map(function(file) {
        gulp.src(file)
            .pipe(minifyCss())
            .pipe(gulp.dest(dirs.dist + file.replace(/^(?:src)/, '').replace(/[^\/]*$/, '')));
    });
});

gulp.task('imageOpt', ['clean'], function() {
    var images = [];
    images = images.concat(getAllFilesFromFolders(dirs.src + '/img'));
    images = images.concat(getAllFilesFromFolders(dirs.src + '/views/images'));
    var streams = images.map(function(image) {
        gulp.src(image)
            .pipe(imgMin())
            .pipe(gulp.dest(dirs.dist + image.replace(/^(?:src)/, '').replace(/[^\/]*$/, '')))
            .pipe(imgResize( {
                '*.png': [{
                    width: 980,
                    suffix: '_980w'
                }, {
                    width: 640,
                    suffix: '_640w'
                }, {
                    width: 320,
                    suffix: '_320w'
                }],
                '*.jpg': [{
                    width: 980,
                    suffix: '_980w'
                }, {
                    width: 640,
                    suffix: '_640w'
                }, {
                    width: 320,
                    suffix: '_320w'
                }]
            }))
            .pipe(gulp.dest(dirs.dist + image.replace(/^(?:src)/, '').replace(/[^\/]*$/, '')));
    });
});

gulp.task('test', ['clean'], function() {
    // var folders = getFolders(dirs.src);
    var files = [];
    files = files.concat(getAllFilesFromFolders(dirs.src + '/css'));
    files = files.concat(getAllFilesFromFolders(dirs.src + '/views/css'));

    var streams = files.map(function(file) {
        console.log(file);
        gulp.src(file)
            .pipe(minifyCss())
            .pipe(gulp.dest(dirs.dist + file.replace(/^(?:src)/, '').replace(/[^\/]*$/, '')));
    });


});

// --------------------------------------------------------------------
// | Main Tasks                                                       |
// --------------------------------------------------------------------

gulp.task('watch', function() {
    reload.listen();
    var filesToWatch = [dirs.src + '/js/*.js', dirs.src + '/views/js/*.js', 'gulpfile.js'];
    gulp.watch(filesToWatch, ['lint:js']);
});

gulp.task('build', ['clean'], function(dog) {
    runSequence(
        ['lint:js', 'minify:js', 'minify:css', 'imageOpt'],
    dog);
});