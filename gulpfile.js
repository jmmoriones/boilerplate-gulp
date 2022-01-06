'use strict';

const gulp = require('gulp'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass')(require('sass')),
	babel = require('gulp-babel'),
	browserify = require('gulp-browserify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	svgmin = require('gulp-svgmin'),
	webp = require('gulp-webp'),
	useref = require('gulp-useref'),
	concat = require('gulp-concat'),
	uncss = require('gulp-uncss'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify-es').default,
	htmlmin = require('gulp-htmlmin'),
	dir = {
		// En este objeto dir, haremos mencion de dichas carpetas que hiremos necesitando
		src: 'src',
		dist: 'dist',
		nm: 'node_modules'
	},
	files = {
		CSS: [
			`${dir.nm}/responsimple/responsimple.min.css`,
			`${dir.nm}/animate.css/animate.min.css`,
			`${dir.nm}/font-awesome/css/font-awesome.min.css`,
			`${dir.nm}/owl.carousel/dist/assets/owl.carousel.min.css`,
			`${dir.nm}/owl.carousel/dist/assets/owl.theme.default.min.css`,
			`${dir.dist}/css/estilos.css`
		],
		mCSS: 'estilos.min.css',
		JS: [
			`${dir.nm}/jquery/dist/jquery.min.js`,
			`${dir.nm}/owl.carousel/dist/owl.carousel.min.js`,
			`${dir.nm}/wowjs/dist/wow.min.js`,
			`${dir.dist}/js/codigos.js`
		],
		mJS: 'codigos.min.js',
		fonts: [`${dir.nm}/font-awesome/fonts/*.*`],
		statics: [
			`${dir.src}/statics/humans.txt`,
			`${dir.src}/statics/robots.xml`,
			`${dir.src}/statics/sitemap.xml`
		]
	},
	opts = {
		pug: {
			pretty: true,
			locals: {
				title: 'Site Web',
				files: files
			}
		},
		sass: {outputStyle: "compressed"},
		es6: {presets: ['es2015']},
		imagemin : { 
			progressive : true,
			use : [ pngquant() ]
		},
		svgmin : { 
			plugins : [ 
				{ convertColors : false },
				{ removeAttrs : { attrs : ['fill'] } }
			]
		},
		uncss : { html : [`${dir.dist}/*.html`] },
		autoprefixer : { 
			browsers : ['last 5 versions'],
			cascade : false 
		},
		htmlmin : {collapseWhitespace: true}
	};

gulp.task('pug', (done) => {
	gulp
		.src( `${dir.src}/pug/*.pug` )
		.pipe( pug(opts.pug) )
		.pipe( gulp.dest(dir.dist) )
	done()
})

gulp.task('sass', (done) => {
	gulp
		.src( `${dir.src}/scss/*.scss` )
		.pipe( sass(opts.sass) )
		.pipe( gulp.dest(`${dir.dist}/css`) )
	done()
})

gulp.task('es6', (done) => {
	gulp
		.src(`${dir.src}/es6/*.js`)
		.pipe( babel(opts.es6) )
		.pipe( browserify({insertGlobals: true}) )
		.pipe( gulp.dest(`${dir.dist}/js`) )
	done()
})

gulp.task('img', (done) => {
	gulp
		.src( `${dir.src}/images/**/*.+(png|jpeg|jpg|gif)` )
		.pipe( imagemin(opts.imagemin) )
		.pipe( gulp.dest(`${dir.dist}/images`) )
	done()
})

gulp.task('svg', (done) => {
	gulp
		.src( `${dir.src}/images/svg/*.svg` )
		.pipe( svgmin(opts.svgmin) )
		.pipe( gulp.dest(`${dir.dist}/images/svg`) );
	done()
});

gulp.task('webp', (done) => {
	gulp
		.src( `${dir.src}/images/**/*.+(png|jpeg|jpg)` )
		.pipe( webp() )
		.pipe( gulp.dest(`${dir.dist}/images/webp`) );
	done()
});

gulp.task('fonts', (done) => {
	gulp
		.src(files.fonts)
		.pipe( gulp.dest(`${dir.dist}/fonts`) );
	done()
});

gulp.task('statics', (done) => {
	gulp
		.src(files.statics)
		.pipe( gulp.dest(`${dir.dist}/statics`) );
	done()
});

gulp.task('css', (done) => {
	gulp
		.src(files.CSS)
		.pipe( concat(files.mCSS) )
		.pipe( uncss(opts.uncss) )
		.pipe( autoprefixer(opts.autoprefixer) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest(`${dir.dist}/css`) )
	done()
})

gulp.task('js', (done) => {
	gulp
		.src( files.JS )
		.pipe( concat(files.mJS) )
		.pipe( uglify() )
		.pipe( gulp.dest(`${dir.dist}/js`) )
	done()
})

gulp.task('html', (done) => {
	gulp
		.src(`${dir.dist}/*.html`)
		.pipe( useref() )
		.pipe( htmlmin(opts.htmlmin) )
		.pipe( gulp.dest(dir.dist) )
	done()
})