const gulp = require('gulp');
const rollup = require('rollup').rollup;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-js').minify;
const _uglify = require('uglify-js').uglify;

gulp.task('default', function() {
    return rollup({
        entry: './src/index.js',
        plugins: [nodeResolve({
                jsnext: true
            }),
            babel({
                exclude: ['node_modules/**']
            }),
            uglify({ }, _uglify)
        ]
    }).then(function(bundle) {
        return bundle.write({
            moduleName: "recorder",
            format: 'umd',
            dest: './dist/bundle.js'
        });
    });
});
