
define([], function () {
	
	// mainRun.$inject = ["$rootScope", "$location", "USER_LOGGED_IN", "Offline"];

	function mainRun(
		$rootScope, $location, $q, USER_LOGGED_IN, Offline, userOnlineService, userOfflineService, syncService) {
		
		$rootScope.$on(USER_LOGGED_IN, function (event, data) {
			$q.when({}).then(function () { 
				if (Offline.state === "up")
					return syncService.synchronizeData();

				return {};
			}).then(function () { 
				$location.path("/home");
			});
		});
		
		$rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
			if (rejection === "UNAUTHORIZED") {
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