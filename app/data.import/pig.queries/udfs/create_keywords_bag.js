createKeywordsBag.outputSchema="y:{t:(candidateMatched:chararray,candidatePreferred:chararray,semType:chararray)}";
function createKeywordsBag(additionalInfosTuple) {
	var keywordsBag = [];

	for (var i = 0; i < additionalInfosTuple.size(); ++i) {
		var additionalInfo = additionalInfosTuple.get(i),
			keywords = additionalInfo.get("keywords");

		for (var j = 0; j < keywords.size(); ++j) {
			var keyword = keywords.get(j);

			keywordsBag.push({
				candidateMatched: keyword.get("candidateMatched"),
				candidatePreferred: keyword.get("candidatePreferred"),
				semType: keyword.get("semTypes").get(0)
			});
		}
	}
 
	return keywordsBag;
}
