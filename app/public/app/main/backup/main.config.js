
define(["app/main/main.routes"], function (mainRoutes) {
	
	function mainConfig($routeProvider) {
		mainRoutes($routeProvider);
	}

	return mainConfig;
});