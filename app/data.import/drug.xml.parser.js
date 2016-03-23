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
		let producer = select("x:document/x:author/x:assignedEntity/x:representedOrganization/x:name/text()", doc)[0].toString();
		let ingredientNodes = select("//x:ingredientSubstance", doc);

		let drug = new Drug({
			name: name,
			producer: producer,
			ingredients: []
		});

		for (let i = 0; i < ingredientNodes.length; ++i) {
			let j = i + 1;
			let code = select("//x:ingredientSubstance[" + j + "]/x:code/@code", doc)[0].nodeValue;
			let name = select("//x:ingredientSubstance[" + j + "]/x:name/text()", doc)[0].toString();

			let substance = new substanceModel.Substance({
				code: code,
				name: name
			});

			drug.ingredients.push(substance);
		}

		drug.save().then(() => deferred.resolve, err => deferred.reject(err));

		// let promise = drug.save();
		// let promises = [promise];
		//
		// ingredients.forEach(ingredient => {
		// 	let promise = Substance.findOneAndUpdate({ code: ingredient.code }, ingredient, { upsert: true });
		//
		// 	promises.push(promise);
		// });
		//
		// q.all(promises).then(() => deferred.resolve(true), err => deferred.reject(err));
	}
	catch (e) {
		console.log(e);

		deferred.reject("Parse error for file " + file + ", details: " + JSON.stringify(e));
	}

	return deferred.promise;
}

module.exports = parseXml;
