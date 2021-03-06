var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var typograf = require("gulp-typograf");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

gulp.task('sass', function() {
	gulp.src('sass/style.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({browsers: [
				"last 1 version",
				"last 2 Chrome versions",
				"last 2 Firefox versions",
				"last 2 Opera versions",
				"last 2 Edge versions"
			]}),
			mqpacker({
				sort: true
			})
		]))

		.pipe(gulp.dest("build/css"))
		.pipe(minify())
		.pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
	return gulp.src("build/img/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
	return gulp.src("build/**/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest("build/img"));
});

gulp.task("typograf", function() {
	gulp.src("build/*.html")
		.pipe(typograf({ locale: ["ru", "en-US"] }))
		.pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
	server.init({
		server: "."
	});

	gulp.watch("sass/**/*.scss", ["sass"]);
	gulp.watch("*.html")
		.on("change", server.reload);
	gulp.watch("*.js")
		.on("change", server.reload);
});

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.{woff,woff2}",
		"css/**",
		"img/**",
		"js/**",
		"*.js",
		"*.html"
	], {
		base: "."
	})

		.pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
	return del("build");
});

gulp.task("build", function(fn) {
	run("clean", "copy", "sass", "images", "symbols", "typograf", fn);
});

gulp.task("default", ["sass", "serve"]);
