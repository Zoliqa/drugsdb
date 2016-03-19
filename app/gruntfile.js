
module.exports = function (grunt) {

	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		nodemon: {
			dev: {
				script: "server.js"
			}
		},
		less: {
			development: {
				options: {
					compress: true,
					optimization: 2
				},
				files: {
					"public/css/index.css": "public/css/less/index.less"
				}
			}
		},
		watch: {
			styles: {
				files: ["public/css/**/*.less"],
				tasks: ["less"],
				options: {
					nospawn: true
				}
			}
		},
		concurrent: {
			dev: {
				tasks: ["nodemon:dev", "watch:styles"],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerInitTask("default", "concurrent:dev");
};
