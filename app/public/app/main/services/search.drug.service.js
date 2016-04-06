define([], function () {

	function searchDrugService($http, $q) {
		var service = {
			search: search,
			name: "searchDrugService",
			description: "drug",
			template: "drug"
		};

		return service;

		function search(term) {
			var deferred = $q.defer();

			$http.post("/main/searchdrug", { term: term }).then(function (result) {
				deferred.resolve(result.data);
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return searchDrugService;
});
