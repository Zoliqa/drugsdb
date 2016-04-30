define([], function () {

	function termService($q, $injector, userService, termDbpediaService) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var deferred = $q.defer();

			userService.current.get().$promise.then(function (user) {
				var serviceImpl;

				try {
					serviceImpl = $injector.get(user.termServiceProvider)
				}
				catch (e) {
					serviceImpl = termDbpediaService;
				}

				serviceImpl.search(term).then(deferred.resolve, deferred.reject);
			});

			return deferred.promise;
		};
	}

	return termService;
});
