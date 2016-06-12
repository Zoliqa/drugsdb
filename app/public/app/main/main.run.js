
define([], function () {

	// mainRun.$inject = ["$rootScope", "$location", "USER_LOGGED_IN", "Offline"];

	function mainRun(
		$rootScope, $location, USER_LOGGED_IN, UNAUTHORIZED, Offline, userOnlineService, userOfflineService) {

		$rootScope.$on(USER_LOGGED_IN, function (event, data) {
			$location.path("/search");
		});

		$rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
			if (rejection === UNAUTHORIZED) {
				$location.path("/user/login");
			}
		});

		Offline.on("down", function () {
			$rootScope.$apply(function () {
				userOfflineService.logout().$promise.finally(function () {
					$location.path("/user/login");
				});
			});
		});

		Offline.on("up", function () {
			$rootScope.$apply(function () {
				userOnlineService.logout().$promise.finally(function () {
					$location.path("/user/login");
				});
			});
		});
	}

	return mainRun;
});
