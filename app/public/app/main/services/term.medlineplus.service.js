define([], function () {

	function termMedlinePlusService($http, $q, jquery) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
 			var url = "/main/searchmedterm?term=" + term;
			var deferred = $q.defer();

			$http.get(url).then(function (result) {
				var xml = jquery.parseXML(result.data);
				var description = jquery(xml).find("list > document:first > content[name='FullSummary']").text();

				description = description.replace(/<[^>]+>/g, "");

				deferred.resolve({
					description: description
				});
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return termMedlinePlusService;
});
