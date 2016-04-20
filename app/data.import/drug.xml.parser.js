"use strict";

const dom        	      = require("xmldom").DOMParser,
	  xpath      	      = require("xpath"),
	  q          	      = require("q"),
	  Drug       	 	  = require("../db/drug.model"),
	  substanceModel      = require("../db/substance.model"),
	  additionalInfoModel = require("../db/additional.info.model"),
	  parseWarnings       = require("./warnings.parser");

function parseXml(xml, file) {
	let deferred = q.defer();

	try {
		let doc = new dom().parseFromString(xml);
		let select = xpath.useNamespaces({ x: "urn:hl7-org:v3" });

		let name = select("string(//x:manufacturedProduct/x:name)", doc);
		let producerId = select("string(x:document/x:author/x:assignedEntity/x:representedOrganization/x:id/@extension)", doc);
		let producerName = select("string(x:document/x:author/x:assignedEntity/x:representedOrganization/x:name/text())", doc);
		let ingredientSubstanceElements = select("//x:ingredientSubstance", doc);

		let drug = new Drug({
			name: name,
			producerId: producerId,
			producerName: producerName,
			ingredients: [],
			additionalInfos: []
		});

		ingredientSubstanceElements.forEach(ingredientSubstanceElement => {
			let code = select("string(./x:code/@code)", ingredientSubstanceElement);
			let name = select("string(./x:name)", ingredientSubstanceElement);

			let substance = new substanceModel.Substance({
				code: code,
				name: name
			});

			drug.ingredients.push(substance);
		});

		let reUnknownSymbols = /[^a-zA-Z,_+-\.,!@#$%^&*();\/|<> ]+/g,
		    reHtmlTags = /<.*?((\/>)|(<\/[^>]+>))/g;

		function addAdditionalInfoToDrug(sectionElement) {
			let code = select("string(./x:code/@code)", sectionElement);
			let name = select("string(./x:code/@displayName)", sectionElement);
			let title = select("string(./x:title)", sectionElement);
			let text = select("string(./x:text)", sectionElement);

			// TODO: fix replacement of html tags inside the text string
			text = text.replace(reHtmlTags, " ");
			text = text.replace(reUnknownSymbols, " ");

			let additionalInfo = additionalInfoModel.AdditionalInfo({
				code: code,
				name: name,
				title: title,
				text: text
			});
			drug.additionalInfos.push(additionalInfo);
		}

		let warningSectionElements = select("//x:section[x:code[@code='34071-1']]", doc);

		if (warningSectionElements.length > 0) {
			let baseSectionElement = warningSectionElements[0];
			addAdditionalInfoToDrug(baseSectionElement);

			let childSectionElements = select(".//x:section", baseSectionElement);
			childSectionElements.forEach(addAdditionalInfoToDrug);
		}

		let promises = drug.additionalInfos.map(additionalInfo => parseWarnings(additionalInfo));

		q.all(promises).then(() => drug.save()).then(deferred.resolve).catch(deferred.reject);
	}
	catch (e) {
		console.log(e);

		deferred.reject("Parse error for file " + file + ", details: " + JSON.stringify(e));
	}

	return deferred.promise;
}

module.exports = parseXml;
