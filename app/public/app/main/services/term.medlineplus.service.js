define([], function () {

	function termMedlinePlusService($http, $q) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var url = "https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=" + term;
			var deferred = $q.defer();

			$http.get(url).then(function (result) {
				var d = result;

				deferred.resolve({
					description: ""
				});
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return termMedlinePlusService;
});
