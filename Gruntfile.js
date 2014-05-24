module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks("grunt-ts");

	grunt.initConfig({

		ts : {

			build : {

				src : ["src/*.ts"
						,"e2e/**/*.ts"
						,"unit/**/*.ts"],

				options : {
					// 'es3' (default) | 'es5'
					target : 'es5',
					// 'amd' (default) | 'commonjs'
					module : 'commonjs',
					// true (default) | false
					sourceMap : true,
					// true | false (default)
					declaration : false,
					// true (default) | false
					removeComments : false
				},
			},
		},

		bowerInstall : {

			target : {

				// Point to the files that should be updated when
				// you run `grunt bower-install`
				src : [
					'e2e/*.html', // .html support...
				],

				// Optional:
				// ---------
				cwd : '',
				dependencies : true,
				devDependencies : true,
				exclude : [],
				fileTypes : {},
				ignorePath : '',
				overrides : {}
			}
		}

	});

	grunt.registerTask("compile-ts", ["ts:build"]);
	
};
