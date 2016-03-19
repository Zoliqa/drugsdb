
define([],
	function () {

		function RegisterController($location, bcrypt, userService) {

			var vm = this;

			vm.genders = {
				male: 1,
				female: 2
			};
			vm.user = {
				username: "",
				password: "",
				confirmedPassword: "",
				firstname: "",
				lastname: "",
				email: "",
				gender: vm.genders.male,
				birthdate: new Date()
			};
			vm.errorMessage = "";
			vm.register = register;
			vm.cancel = cancel;

			function register() {
				if (vm.user.password !== vm.user.confirmedPassword) {
					vm.errorMessage = "Password and confirmed password don't match.";

					return;
				}

				var salt = bcrypt.genSaltSync(10);
				vm.user.password = bcrypt.hashSync(vm.user.password, salt);

				userService.current.save(vm.user, function (user) {
					$location.path("/login");
				});
			};

			function cancel () {
				$location.path("/login");
			};
		}

		return RegisterController;
	}
);
