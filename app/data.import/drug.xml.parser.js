"use strict";

const AdmZip    = require("adm-zip"),
	  dom       = require("xmldom").DOMParser,
	  xpath     = require("xpath"),
	  Drug      = require("../db/drug.model.js"),
	  Substance = require("../db/substance.model.js");

function parseXml(xml, file) {
	try {
		var doc = new dom().parseFromString(xml);
		var select = xpath.useNamespaces({ x: "urn:hl7-org:v3" });

		// var name = select("/x:document/x:title/text()", doc)[0].toString();
		var name = select("//x:manufacturedProduct/x:name/text()", doc)[0].toString();
		var producer = select("x:document/x:author/x:assignedEntity/x:representedOrganization/x:name/text()", doc)[0].toString();
		var ingredientNodes = select("//x:ingredientSubstance", doc);
		var ingredients = [];

		for (let i = 0; i < ingredientNodes.length; ++i) {
			let j = i + 1;
			let code = select("//x:ingredientSubstance[" + j + "]/x:code/@code", doc)[0].nodeValue;
			let name = select("//x:ingredientSubstance[" + j + "]/x:name/text()", doc)[0].toString();

			// console.log(code + " " + name);

			ingredients.push({ code: code, name: name });
		}

		console.log(name + " " + producer);

		var drug = new Drug({
			name: name,
			producer: producer,
			ingredients: ingredients.reduce((prev, ingredient) => prev + "," + ingredient.code, "").slice(1)
		});

		// console.log(drug);

		drug.save((err, drug) => {
			if (err)
				console.log("Db error for drug for file " + file + ", details: " + err);
			else
				console.log("Drug saved for file " + file);
		});

		ingredients.forEach(ingredient => {
			Substance.findOneAndUpdate({ code: ingredient.code }, ingredient, { upsert: true }, (err, substance) => {
				if (err)
					console.log("Db error for substance for file " + file + ", detals: " + err);
			});
		});
	}
	catch(e){
		console.log("Parse error for file " + file + ", details: " + JSON.stringify(e));
	}
}

module.exports = parseXml;
