define([], function () {

	function RegisterController($location, bcrypt, userService) {
		var vm = this;

		this.termServiceProviders = {
			"termDbpediaService": "DBPedia",
			"termMedlinePlusService": "MedlinePlus"
		};
		this.user = {
			username: "",
			password: "",
			confirmedPassword: "",
			firstname: "",
			lastname: "",
			email: "",
			birthdate: new Date(),
			termServiceProvider: Object.keys(vm.termServiceProviders)[0],
			isAdmin: false
		};
		this.errorMessage = "";
		this.register = register;
		this.cancel = cancel;
		this.selectTermServiceProvider = selectTermServiceProvider;

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

		function selectTermServiceProvider(termServiceProviderKey) {
			vm.user.termServiceProvider = termServiceProviderKey;
		}
	}

	return RegisterController;
});
