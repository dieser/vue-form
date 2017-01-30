'use strict';

const config = require('./sdk.js');

const EOL = require('os').EOL;
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat-util');

const env = 'NODE_ENV' in process.env ? process.env.NODE_ENV : 'development';

const environments = { DEV: 'development', PROD: 'production' };
const dirs = { sass: './sass/**/*.scss', js: './js/**/*.js', components: './components' };

gulp.task('sass', () => {
	gulp.src(dirs.sass)
		.pipe(sass({ style: env === environments.DEV ? 'expanded' : 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
	let pipe = gulp.src(dirs.js)
		.pipe(babel({ presets: ['es2015'] }));

	if (env !== environments.DEV) {
		pipe = pipe.pipe(uglify());
	}
	
	pipe.pipe(gulp.dest('./public/js'));
});

gulp.task('bundles', () => {
	if ('bundles' in config) {
		for (let name in config.bundles) {
			if (Array.isArray(config.bundles[name])) {
				let type = name.match(/\.(\w+)$/);

				if (type && ['js', 'css'].indexOf(type[1]) >= 0) {
					let pipe = gulp.src(config.bundles[name])
						.pipe(concat(name));
					
					/* Uglify error here, investigate.
					if (env !== environments.DEV) {
						pipe = pipe.pipe(uglify());
					}
					*/

					pipe.pipe(gulp.dest('./public/' + type[1]));
				} else {
					throw new Error('Bundles must be either .js or .css types.');
				}
			} else {
				throw new Error('Bundles must be of type string[].');
			}
		}
	}
});

gulp.task('components', () => {
	if ('components' in config) {
		let scss = [];
		let js = [];

		if ('include' in config.components && Array.isArray(config.components.include)) {
			let filename = 'filename' in config.components ? config.components.filename : 'components.bundle';

			config.components.include.forEach(name => {
				let jfile = dirs.components + '/' + name + '/' + name + '.js';
				let sfile = dirs.components + '/' + name + '/' + name + '.scss';

				if (fs.existsSync(jfile)) js.push(jfile);
				if (fs.existsSync(sfile)) scss.push(sfile);
			});

			if (scss.length > 0) {
				gulp.src(scss)
					.pipe(concat(filename + '.css', { process: (src, file) => {
						return '.component--' + path.basename(file, '.scss') + ' {' + src + '}';
					} }))
					.pipe(sass({ style: env === environments.DEV ? 'expanded' : 'compressed' }).on('error', sass.logError))
					.pipe(gulp.dest('./public/css'));
			}

			if (js.length > 0) {
				let pipe = gulp.src(js)
					.pipe(babel({ presets: ['es2015'] }))
					.pipe(concat(filename + '.js'));
				
				if (env !== environments.DEV) {
					pipe = pipe.pipe(uglify());
				}
				
				pipe.pipe(gulp.dest('./public/js'));
			}
		}
	}
});

gulp.task('watch', () => {
	gulp.watch(dirs.sass, ['sass']);
	gulp.watch(dirs.js, ['js']);
	gulp.watch([dirs.components + '/**/*.js', dirs.components + '/**/*.scss'], ['components']);
});

gulp.task('compile', ['sass', 'js', 'bundles', 'components']);
gulp.task('default', env === environments.DEV ? ['compile', 'watch'] : ['compile']);