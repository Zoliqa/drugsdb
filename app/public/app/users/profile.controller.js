define([], function () {

	function ProfileController(bcrypt, userService, cacheService) {
		var vm = this;

		this.shouldChangePassword = false;
		this.termServiceProviders = {
			"termDbpediaService": "DBPedia",
			"termMedlinePlusService": "MedlinePlus"
		};
		this.user = userService.current.get();
		this.errorMessage = "";
		this.resultMessage = "";
		this.save = save;
		this.selectTermServiceProvider = selectTermServiceProvider;
		this.setChangePasswordState = setChangePasswordState;

		function save() {
			vm.errorMessage = vm.resultMessage = "";

			if (vm.shouldChangePassword) {
				if (!bcrypt.compareSync(vm.user.oldPassword, vm.user.password)) {
					vm.errorMessage = "Old password is incorrect";

					return;
				}

				if (vm.user.newPassword !== vm.user.confirmedNewPassword) {
					vm.errorMessage = "Password and confirmed password don't match.";

					return;
				}

				var salt = bcrypt.genSaltSync(10);

				vm.user.password = bcrypt.hashSync(vm.user.newPassword, salt);
			}

			userService.current.update(vm.user, function (user) {
				vm.resultMessage = "User profile has been updated.";

				vm.shouldChangePassword = false;

				// need to empty cache because next time we want to get the real user instead of empty object
				cacheService.invalidate("/user");
			});
		};

		function selectTermServiceProvider(termServiceProviderKey) {
			vm.user.termServiceProvider = termServiceProviderKey;
		}

		function setChangePasswordState() {
			vm.shouldChangePassword = !vm.shouldChangePassword;
		}
	}

	return ProfileController;
});
