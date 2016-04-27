define([], function () {

	function termService($q, $injector, userService, termDbpediaService) {
		var service = {
			current: null
		};

		init();

		return service;

		function init() {
			var deferred = $q.defer();

			service.current = deferred.promise;

			userService.current.get().$promise.then(function (user) {
				var service;

				try {
					service = $injector.get(user.termServiceProvider)
				}
				catch (e) {
					service = termDbpediaService;
				}

				deferred.resolve(service);
			});
		};
	}

	return termService;
});
