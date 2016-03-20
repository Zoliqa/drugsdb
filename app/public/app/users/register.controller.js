define([], function () {

	function RegisterController($location, bcrypt, userService) {
		var vm = this;

		vm.user = {
			username: "",
			password: "",
			confirmedPassword: "",
			firstname: "",
			lastname: "",
			email: "",
			birthdate: new Date(),
			isAdmin: false
		};
		vm.errorMessage = "";
		vm.register = register;
		vm.cancel = cancel;

		function register() {
			if (vm.user.password !== vm.user.confirmedPassword) {
				vm.errorMessage = "Password and confirmed password don't match.";

				return;
			}

			userService.current.getByUsername({ username: vm.user.username }).$promise.then(function (user) {
				if (!user._id) {
					var salt = bcrypt.genSaltSync(10);
					vm.user.password = bcrypt.hashSync(vm.user.password, salt);

					userService.current.save(vm.user, function (user) {
						$location.path("/login");
					});
				}
				else
					vm.errorMessage = "Selected username is already taken.";
			});
		};

		function cancel () {
			$location.path("/login");
		};
	}

	return RegisterController;
});
