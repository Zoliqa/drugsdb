define([], function () {

	function PageHeaderController($rootScope, $location, USER_LOGGED_IN, userService) {
		var vm = this;

		this.isDisabled = true;
		this.logout = logout;
		this.isAdmin = false;
		this.user = null;

		(function init() {
			userService.current.get().$promise.then(function (user) {
				if (user._id) {
					vm.isDisabled = false;
					vm.user = user;
				}
			});

			$rootScope.$on(USER_LOGGED_IN, function (event, data) {
				vm.isDisabled = false;
				vm.user = data;
			});
		})();

		function logout() {
			userService.current.logout().$promise.finally(function () {
				vm.isDisabled = true;

				$location.path("/user/login");
			});
		}
	}

	return PageHeaderController;
});
