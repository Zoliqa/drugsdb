
define(["bcrypt", "app/users/users.routes"], function (bcrypt, usersRoutes) {
	
	usersConfig.$inject = ["$provide", "$routeProvider"];

	function usersConfig($provide, $routeProvider) {
		$provide.value("bcrypt", bcrypt);

		usersRoutes($routeProvider);
	}

	return usersConfig;
});