var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();


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
			]})
		]))

		.pipe(gulp.dest('css'))
		.pipe(server.stream());
});

gulp.task("serve", ["sass"], function() {
	server.init({
		server: ".",
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch("sass/**/*.scss", ["sass"]);
	gulp.watch("*.html")
		.on("change", server.reload);
	gulp.watch("*.js")
		.on("change", server.reload);
});

gulp.task("default", ["sass", "serve"]);
