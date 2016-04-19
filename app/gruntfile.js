module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		express: {
			options: {
		  	},
			web: {
				options: {
			  		script: "server.js",
				}
			}
		},
		less: {
			dev: {
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
		  	frontend: {
			    options: {
			      	livereload: true
			    },
			    files: [
			      	"public/app/**/*",
					"public/css/**/*",
					"views/index.ejs"
			    ]
		  	},
			less: {
				files: ["public/css/**/*.less"],
				tasks: ["less:dev"],
				options: {
					nospawn: true
				}
			},
		  	server: {
			    files: [
			      	"data.import/**/*",
					"db/**/*",
					"logger/**/*",
					"passport/**/*",
					"routes/**/*",
					"gruntfile.js",
					"server.js"
			    ],
			    tasks: [
      				"express:web"
			    ],
			    options: {
		      		nospawn: true,
			      	atBegin: true
			    }
		  	}
		},
		concurrent: {
			dev: {
				tasks: ["watch:frontend", "watch:less", "watch:server"],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerInitTask("default", "concurrent:dev");
};
