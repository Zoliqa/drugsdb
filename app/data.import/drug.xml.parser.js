"use strict";

const AdmZip     	  = require("adm-zip"),
	  dom        	  = require("xmldom").DOMParser,
	  xpath      	  = require("xpath"),
	  q          	  = require("q"),
	  Drug       	  = require("../db/drug.model.js"),
	  substanceModel  = require("../db/substance.model.js");

function parseXml(xml, file) {
	let deferred = q.defer();

	try {
		let doc = new dom().parseFromString(xml);
		let select = xpath.useNamespaces({ x: "urn:hl7-org:v3" });

		let name = select("//x:manufacturedProduct/x:name/text()", doc)[0].toString();
		let producer_id = select("x:document/x:author/x:assignedEntity/x:representedOrganization/x:id/@extension", doc)[0].nodeValue;
		let producer_name = select("x:document/x:author/x:assignedEntity/x:representedOrganization/x:name/text()", doc)[0].toString();
		let ingredientNodes = select("//x:ingredientSubstance", doc);

		let drug = new Drug({
			name: name,
			producer_id: producer_id,
			producer_name: producer_name,
			ingredients: [],
			additionalInfos: []
		});

		for (let i = 0; i < ingredientNodes.length; ++i) {
			// let code = select(".//x:ingredientSubstance/x:code/@code", ingredientNodes[i])[0].nodeValue;
			// let name = select(".//x:ingredientSubstance/x:code/text()", ingredientNodes[i])[0].toString();

			let j = i + 1;
			let code = select("//x:ingredientSubstance[" + j + "]/x:code/@code", doc)[0].nodeValue;
			let name = select("//x:ingredientSubstance[" + j + "]/x:name/text()", doc)[0].toString();

			let substance = new substanceModel.Substance({
				code: code,
				name: name
			});

			drug.ingredients.push(substance);
		}

		let warningSectionNodes = select("//x:section[x:code[@code='34071-1']]", doc);

		if (warningSectionNodes.length > 0) {
			let baseSectionElement = warningSectionNodes[0];

			let code = select("string(./x:code/@code)", baseSectionElement);
			let title = select("string(./x:title)", baseSectionElement);
			let text = select("string(./x:text)", baseSectionElement);

			console.log(code + title + text);

			let childSectionElements = select(".//x:section", baseSectionElement);

			childSectionElements.forEach(childSection => {
				let code = select("string(./x:code/@code)", childSection);
				let title = select("string(./x:title)", childSection);
				let text = select("string(./x:text)", childSection);

				console.log(code + title + text);
			});
		}

		drug.save().then(deferred.resolve, deferred.reject);
	}
	catch (e) {
		console.log(e);

		deferred.reject("Parse error for file " + file + ", details: " + JSON.stringify(e));
	}

	return deferred.promise;
}

module.exports = parseXml;
