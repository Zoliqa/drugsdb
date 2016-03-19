define([], function () {

	usersConfig.$inject = ["$routeProvider"];

	function usersConfig($routeProvider) {
		$routeProvider
			.when("/user/login", {
				templateUrl: "/public/app/users/login.html",
				controller: "LoginController",
				controllerAs: "vm"
			})
			.when("/user/register", {
				templateUrl: "/public/app/users/register.html",
				controller: "RegisterController",
				controllerAs: "vm"
			})
			.when("/user/profile", {
				templateUrl: "/public/app/users/profile.html",
				controller: "ProfileController",
				controllerAs: "vm"
			})
			.otherwise({
				redirectTo: "/user/login"
			});
	}

	return usersConfig;
});
