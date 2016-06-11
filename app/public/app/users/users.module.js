define([
	"angular",
	"angularRoute",
	"angularResource",
	"underscore",
	"bcrypt",
	"offline",
	"app/users/login.controller",
	"app/users/register.controller",
	"app/users/profile.controller",
	"app/users/user.service",
	"app/users/user.online.service",
	"app/users/user.offline.service",
	"app/users/users.config",
	"app/users/users.run"],
	function (angular,
			  angularRoute,
			  angularResource,
			  _,
			  bcrypt,
			  offline,
			  LoginController,
			  RegisterController,
			  ProfileController,
			  userService,
			  userOnlineService,
			  userOfflineService,
			  usersConfig,
			  usersRun) {

		angular.module("users", ["ngRoute", "ngResource"])
			.controller("LoginController", LoginController)
			.controller("RegisterController", RegisterController)
			.controller("ProfileController", ProfileController)
			.factory("userService", userService)
			.factory("userOnlineService", userOnlineService)
			.factory("userOfflineService", userOfflineService)
			.constant("UNAUTHORIZED", "UNAUTHORIZED") // ????
			.constant("USER_LOGGED_IN", "USER_LOGGED_IN")
			.constant("USER_LOGGED_OUT", "USER_LOGGED_OUT")
			.constant("Offline", Offline)
			.constant("_", _)
			.constant("bcrypt", bcrypt)
			.config(usersConfig)
			.run(usersRun);
	}
);
