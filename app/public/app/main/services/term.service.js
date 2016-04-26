define([], function () {

	function termService($q, $injector, userService) {
		var service = {
			current: null
		};

		init();

		return service;

		function init() {
			var deferred = $q.defer();

			service.current = deferred.promise;

			userService.current.get().$promise.then(function (user) {
				deferred.resolve($injector.get(user.termServiceProvider));
			});
		};
	}

	return termService;
});
