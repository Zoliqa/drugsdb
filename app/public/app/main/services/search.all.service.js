define([], function () {

	function searchAllService($http, $q) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var deferred = $q.defer();

			$http.post("/main/searchall", { term: term }).then(function (result) {
				deferred.resolve(result.data);
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return searchAllService;
});
