var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    fs = require('fs'),
    path = require('path'),
    pkg = require('./package.json'),
    plumber = require('gulp-plumber'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    reload = require('gulp-livereload'),
    imgMin = require('gulp-image'),
    minifyHtml = require('gulp-html-minifier'),
    gulpif = require('gulp-if');

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
    'copy:html'
]);

gulp.task('copy:html', ['clean'], function() {
    return gulp.src([
        dirs.src + '/**/*',

        '!' + dirs.src + '/**/*.css',
        '!' + dirs.src + '/**/*.js',
        '!' + dirs.src + '/**/*.png',
        '!' + dirs.src + '/**/*.jpg'
    ], {

        // include hidden files by default
        dot: true
    })
        .pipe(gulp.dest(dirs.dist));
});

// JavaScript Related tasks
var onError = function(err) {
    console.log(err.message);
};

gulp.task('lint:js', ['clean'], function() {
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

gulp.task('minify:js', ['lint:js', 'clean'],  function() {
    var files = [];
    files = files.concat(getAllFilesFromFolders(dirs.src + '/js'));
    files = files.concat(getAllFilesFromFolders(dirs.src + '/views/js'));

    var streams = files.map(function(file) {
        gulp.src(file, { base: './src' })
            .pipe(uglify())
            .pipe(gulp.dest(dirs.dist));
    });

});

gulp.task('minify:css', ['clean'], function() {
    var files = [];
    files = files.concat(getAllFilesFromFolders(dirs.src + '/css'));
    files = files.concat(getAllFilesFromFolders(dirs.src + '/views/css'));

    var streams = files.map(function(file) {
        gulp.src(file, { base: './src' })
            .pipe(minifyCss())
            .pipe(gulp.dest(dirs.dist));
    });
});

gulp.task('minify:html', ['clean'], function() {
    var files = [
        dirs.src + '/index.html',
        dirs.src + '/project-2048.html',
        dirs.src + '/project-mobile.html',
        dirs.src + '/project-webperf.html',
        dirs.src + '/views/pizza.html'
    ];

    var streams = files.map(function(file) {
        gulp.src(file, { base: './src'})
            .pipe(minifyHtml({ collapseWhitespace: true }))
            .pipe(gulp.dest(dirs.dist));
    });
});

gulp.task('imageOpt', ['clean'], function() {
    var images = [];
    images = images.concat(getAllFilesFromFolders(dirs.src + '/img'));
    images = images.concat(getAllFilesFromFolders(dirs.src + '/views/images'));
    var streams = images.map(function(image) {
        gulp.src(image)
            .pipe(imgMin())
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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var htmlFile = function(file) {
    // var test = file.path.endsWith('.html');
    // console.log(file.toString() + ' : ' + test);
    return (file.path.endsWith('.html'));
};

var jsFile = function(file) {
    return (file.path.endsWith('.js'));
};

var cssFile = function(file) {
    return (file.path.endsWith('.css'));
};

gulp.task('test2', ['clean', 'lint:js'], function() {
    gulp.src(dirs.src + '/**/*', { base: './src' })
        .pipe(gulpif(htmlFile, minifyHtml({ collapseWhitespace: true })))
        .pipe(gulpif(jsFile, uglify()))
        .pipe(gulpif(cssFile, minifyCss()))
        .pipe(gulp.dest(dirs.dist));

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
        // ['lint:js', 'minify:js', 'minify:css', 'imageOpt', 'minify:html'],
        ['lint:js', 'test2'],
    dog);
});