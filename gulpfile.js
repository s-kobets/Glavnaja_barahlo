/*var gulp = require('gulp');
var sprite = require('gulp.spritesmith');

gulp.task('sprite', function () {
  return  gulp.src('images/*.png')
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }))
    .pipe(gulp.dest('path/to/output/'));
});

gulp.task('default',['sprite']);*/
// ############ PACKAGES ############
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),

    notify = require('gulp-notify'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    cssmin = require('gulp-minify-css'),
    csso = require('gulp-csso'),

    fileinclude = require('gulp-file-include'),
    plumber = require('gulp-plumber'),
    prettify = require('gulp-html-prettify'),

    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),

    connect = require('gulp-connect'),
    opn = require('opn');

// ############ SETTINGS ############
var path = {
    public: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'public/',
        js: 'public/js/',
        css: 'public/css/',
        img: 'public/img/',
        fonts: 'public/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/scripts/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/styles/main.styl',
        sprite:'src/styles/partials/sprite.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/scripts/**/*.js',
        style: 'src/styles/**/*.styl',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};
// ####################### server
var server = {
    host: 'localhost',
    port: '9000'
};

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
    opn( 'http://' + server.host + ':' + server.port + '/'+ path.public.html );
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/'+ path.public.html );
});

// ############склеиваем и расстановка отступов ############
gulp.task('html', function() {
  gulp.src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))

    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(path.public.html))
    .pipe(notify("Done fileinclude!"))
    .pipe(connect.reload());
});

// ############ склейка из разных js и minific ############
gulp.task('script', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(plumber()) // plumber
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        //.pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest(path.public.js)) //Выплюнем готовый файл в public
        .pipe(notify("Done uglify!"))
        .pipe(connect.reload());

});

// ############ склейка из разных css и minific ############
gulp.task('style', function () {
    gulp.src([path.src.style, path.src.sprite]) //Выберем наш main.less
        .pipe(plumber()) // plumber
        .pipe(stylus({
            'include css': true,
            use: (nib())
          }))//Скомпилируем
        .pipe(csso()) //сжимаем
        .pipe(gulp.dest(path.public.css)) //И в public
        .pipe(notify("Done cssmin!"))
        .pipe(connect.reload());

});
// ############ fonts ############


gulp.task('sprite', function() {
    var spriteData =
        gulp.src(path.src.img)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

            return spriteData.pipe(gulp.dest(path.public.img));

    var cssStream = spriteData.css
        .pipe(gulp.dest(path.src.sprite));

    return merge(cssStream);
});

// ############ fonts ############
gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(plumber()) // plumber
        .pipe(gulp.dest(path.public.fonts))
        .pipe(notify("Done fonts!"));
});


// ############     server      ############
/*gulp.task('server', function() {
    if (argv.port) {
        path.server.port = argv.port
    }
    if (argv.browser) {
        path.server.open = 'http://' + path.server.host + ':' + path.server.port + '/' + path.public;
        path.server.directoryListing = false;
    }
    gulp.src('./').pipe(webserver(path.server));
});
// ############  чистим папку public   ############
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);

});*/

// ############  сборка проекта в папку  ############
gulp.task('build', ['html','script','style','fonts','sprite']);

// ############   команда gulp запускает сборку и сервер ############
gulp.task('default', ['build', 'webserver', 'watch','openbrowser']);

// ############  следит за изменениями в файлах   ############
gulp.task('watch', function(){

    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('script');
    });

    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });

    watch([path.watch.img], function(event, cb) {
        gulp.start('sprite');
    });
});

/* browsersync *//*
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    .pipe(reload({stream: true}))


gulp.task('webserver', function () {
    browserSync(config);
});
var config = {
    server: {
        baseDir: "public"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};
*/

/*

*/
