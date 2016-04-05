define([], function () {

	function searchProducerService($http, $q) {
		var service = {
			search: search,
			name: "searchProducerService"
		};

		return service;

		function search(term) {
			var deferred = $q.defer();

			$http.post("/main/searchproducer", { term: term }).then(function (result) {
				deferred.resolve(result.data);
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return searchProducerService;
});
