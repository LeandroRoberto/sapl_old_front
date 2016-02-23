var gulp = require('gulp'), 
    sass = require('gulp-sass') ,
    notify = require("gulp-notify") ,
    bower = require('gulp-bower');

// source and distribution folder
var
    source = 'src/',
    dest = './';

// Bootstrap scss source
var bootstrapSass = {
        in: './bower_components/bootstrap-sass/'
    };

// fonts
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };


// css source file: .scss files
var css = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets', './bower_components/font-awesome/scss',]
    }
};
var css2 = {
    in: source + 'scss/estilos.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
    }
};

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});


gulp.task('icons', function() { 
    return gulp.src('./bower_components/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./fonts')); 
});


// compile scss
gulp.task('sass', ['fonts','icons'], function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

// compile scss
gulp.task('sass2', ['fonts','icons'], function () {
    return gulp.src(css2.in)
        .pipe(sass(css2.sassOpts))
        .pipe(gulp.dest(css2.out));
});

// default task
gulp.task('default', ['sass','sass2'], function () {
     gulp.watch(css.watch, ['sass','sass2']);
});








/*



gulp.task('icons', function() { 
    return gulp.src('./bower_components/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./dist/fonts')); 
});


*/
 //gulp.task('watch', function() {
 //    gulp.watch(config.sassPath + '/**/*.scss', ['scss']); 
//});

  //gulp.task('default', ['bower', 'icons', 'scss']);
