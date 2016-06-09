var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: "/base",

	paths: {
		"app": "public/app",
		"angular": "public/lib/angular/angular",
		"angularMocks": "public/lib/angular-mocks/angular-mocks",
		"angularRoute": "public/lib/angular-route/angular-route",
		"angularResource": "public/lib/angular-resource/angular-resource",
		"jquery": "public/lib/jquery/dist/jquery",
		"underscore": "public/lib/underscore/underscore",
		"bootstrap": "public/lib/bootstrap/dist/js/bootstrap",
		"uiBootstrapTpls": "public/lib/angular-bootstrap/ui-bootstrap-tpls",
		"bcrypt": "public/lib/bcryptjs/dist/bcrypt",
		"offline": "public/lib/offline/offline",
		"offlineSimulateUI": "public/lib/offlinejs-simulate-ui/offline-simulate-ui.min",
		"dexie": "public/lib/dexie/dist/latest/Dexie",
		"io": "public/lib/socket.io-client/socket.io"
	},

	shim: {
		"angular": {
			exports: "angular"
		},
		"angularMocks": {
			exports: "angularMocks",
			deps: ["angular"]
		},
		"angularRoute": {
			deps: ["angular"],
			exports: "angularRoute"
		},
		"angularResource": {
			deps: ["angular"],
			exports: "angularResource"
		},
		"uiBootstrapTpls": {
			deps: ["angular"],
			exports: "uiBootstrapTpls"
		},
		"jQuery": {
			exports: "jQuery"
		},
		"bootstrap": {
			deps: ["jquery"],
			exports: "bootstrap"
		},
		"offlineSimulateUI": {
			deps: ["offline"],
			exports: "offlineSimulateUI"
		}
	},

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});
