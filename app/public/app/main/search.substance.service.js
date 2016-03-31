define([], function () {

	function searchSubstanceService($http, $q) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var deferred = $q.defer();

			$http.post("/main/searchsubstance", { term: term }).then(function (result) {
				deferred.resolve(result.data);
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return searchSubstanceService;
});
