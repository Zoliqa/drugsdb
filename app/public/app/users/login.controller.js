
define([],
	function () {

		function LoginController($scope, $location, userService, cacheService, USER_LOGGED_IN, dbService) {
			var vm = this;

			vm.credentials = {
				username: $location.search().username || "",
				password: ""
			};
			vm.isUsernameEmpty = isUsernameEmpty;
			vm.isPasswordEmpty = isPasswordEmpty;
			vm.errorMessage = "";
			vm.logIn = logIn;
			vm.register = register;

			function isUsernameEmpty() {
				return vm.credentials.username.length === 0 || !!/\s+/.exec(vm.credentials.username);
			}

			function isPasswordEmpty() {
				return vm.credentials.password.length === 0 || !!/\s+/.exec(vm.credentials.password);
			}

			function logIn() {
				vm.errorMessage = "";

				if (!vm.isUsernameEmpty() && !vm.isPasswordEmpty()) {
					userService.current.login(vm.credentials).$promise.then(function (user) {
						if (user._id) {
							$scope.$emit(USER_LOGGED_IN, user);
						}
						else
							vm.errorMessage = "Wrong username and/or password";

						// need to empty cache because next time we want to get the real user instead of empty object
						cacheService.invalidate("/user");
					});
				}
				else
					vm.errorMessage = "Username and/or password is empty";
			}

			function register () {
				$location.path("/user/register");
			};
		}

		return LoginController;
	}
);
