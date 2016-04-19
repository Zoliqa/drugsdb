createSubstancesBag.outputSchema="y:{t:(id:chararray,name:chararray,code:chararray)}";
function createSubstancesBag(substancesTuple) {
	var substancesBag = [];

	for (var i = 0; i < substancesTuple.size(); ++i) {
		var substance = substancesTuple.get(i);

		substancesBag.push({
			name: substance.get("name"),
			code: substance.get("code")
		});
	}
 
	return substancesBag;
}
