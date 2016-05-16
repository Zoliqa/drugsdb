define([], function () {

	function termDbpediaService($http, $q, _, levenhsteinDistanceService) {
		var service = {
			search: search
		};

		return service;

		function search(term) {
			var url = "http://dbpedia.org/sparql",
				deferred = $q.defer(),
				query =
				"PREFIX dbo: <http://dbpedia.org/ontology/>" +
				"PREFIX terms: <http://purl.org/dc/terms/>" +

				"SELECT DISTINCT *" +
				"WHERE {" +

   				"	{" +
      			" 		?s skos:broader <http://dbpedia.org/resource/Category:Symptoms_and_signs>  ." +
      			"		?s2 terms:subject ?s ." +
      			"		?s2 rdfs:label ?label ." +
      			"		?s2 rdfs:comment ?comment ." +

      			"		FILTER (regex(?label, 'KEYWORD', 'i'))" +
      			"		FILTER (lang(?label) = 'en')" +
      			"		FILTER (lang(?comment) = 'en')" +
   				"	}" +

				"	UNION" +

				"   {" +
				"     	?s skos:broader <http://dbpedia.org/resource/Category:Symptoms_and_signs>  ." +
				"     	?s2 terms:subject ?s ." +
				"     	?s2 rdfs:label ?label ." +
				"     	?s2 rdfs:comment ?comment ." +
				"     	?s3 dbo:wikiPageRedirects ?s2 ." +

				"     	FILTER (regex(?s3, 'KEYWORD', 'i'))" +
				"     	FILTER (lang(?label) = 'en')" +
				"   	FILTER (lang(?comment) = 'en')" +
			    "	}" +

				"	UNION" +

   				"	{" +
      			"		?s rdf:type dbo:Disease ." +
      			"		?s rdfs:label ?label ." +
      			"		?s rdfs:comment ?comment ." +

      			"		FILTER (regex(?label, 'KEYWORD', 'i'))" +
      			"		FILTER (lang(?label) = 'en')" +
      			"		FILTER (lang(?comment) = 'en')" +
   				"	}" +

   				"	UNION" +

   				"	{" +
      			"		?s rdf:type dbo:Disease ." +
      			"		?s rdfs:label ?label ." +
      			"		?s rdfs:comment ?comment ." +
      			"		?s2 dbo:wikiPageRedirects ?s" +

      			"		FILTER (regex(?s2, 'KEYWORD', 'i'))" +
      			"		FILTER (lang(?label) = 'en')" +
      			"		FILTER (lang(?comment) = 'en')" +
   				"	}" +
				"}";

			query = query.replace(/KEYWORD/g, term);

			var urlWithQuery = encodeURI(url + "?query=" + query + "&format=json");

			$http.get(urlWithQuery).then(function (result) {
				var items = result.data.results.bindings,
					closestItem,
					minDistance = 1000;

				_.each(items, function (item) {
					var distance = levenhsteinDistanceService.getDistance(item.label.value, term);

					if (distance < minDistance) {
						minDistance = distance;

						closestItem = item;
					}
				});

				deferred.resolve({
					description: closestItem && closestItem.comment.value
				});
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return termDbpediaService;
});
