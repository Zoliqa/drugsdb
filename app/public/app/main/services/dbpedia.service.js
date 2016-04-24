define([], function () {

	function dbpediaService($http, $q) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var url = "http://dbpedia.org/sparql";
			var query =
				"PREFIX terms: <http://purl.org/dc/terms/>" +
				"PREFIX dbpedia2: <http://dbpedia.org/property/>" +

				"SELECT ?name, ?comment " +
				"WHERE { " +
				"	{ ?subject a <http://dbpedia.org/ontology/Disease> . } " +
				"	UNION " +
				"	{ ?subject terms:subject <http://dbpedia.org/resource/Category:Medical_signs> . } " +

				"	?subject dbpedia2:name ?name . " +
				"	?subject rdfs:comment ?comment . " +

				"	FILTER(regex(?name, \"" + term + "\", \"i\")) " +
				"	FILTER(lang(?name) = \"en\") " +
				"	FILTER(lang(?comment) = \"en\") " +
				"} " +
				"ORDER BY strlen(?name) " +
				"LIMIT 1";

			var urlWithQuery = encodeURI(url + "?query=" + query + "&format=json");
			var deferred = $q.defer();

			$http.get(urlWithQuery).then(function (result) {
				var item = result.data.results.bindings[0];

				deferred.resolve({
					description: item && item.comment.value
				});
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return dbpediaService;
});
