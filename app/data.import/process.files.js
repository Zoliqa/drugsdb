"use strict";

const fs	           = require("fs"),
	  q	               = require("q"),
	  AdmZip           = require("adm-zip"),
	  dom              = require("xmldom").DOMParser,
	  xpath    	       = require("xpath"),
	  parseXml         = require("./drug.xml.parser"),
	  connection       = require("../db/connection"),
	  drugQueries      = require("../db/drug.queries"),
	  substanceQueries = require("../db/substance.queries"),
	  producerQueries  = require("../db/producer.queries"),
	  findingQueries   = require("../db/finding.queries"),
	  parseWarnings    = require("./warnings.parser"),
	  // dirname          = "/home/zoliqa/Documents/drugsdb/input/selected/";
	  dirname    	   = process.argv[2];

let promises = [];

drugQueries.removeAll()
.then(() => substanceQueries.removeAll())
.then(() => producerQueries.removeAll())
.then(() => findingQueries.removeAll())
.then(() => {
	let allZipFiles = [],
		checkZipFiles = dir => {
			let files = fs.readdirSync(dir).map(file => dir + "/" + file),
				zipFiles = files.filter(file => file.endsWith(".zip"));

			[].push.apply(allZipFiles, zipFiles);

			let dirs = files.filter(file => fs.lstatSync(file).isDirectory());

			dirs.forEach(checkZipFiles);
		};

	checkZipFiles(dirname);

	return allZipFiles;
})
.then(zipFiles => {
	return zipFiles.map(file => {
		let zip = new AdmZip(file);

		return zip.getEntries().filter(entry => entry.entryName.endsWith(".xml")).map(entry => zip.readAsText(entry.entryName));
	}).reduce((prev, curr) => prev.concat(curr), []);
})
.then(xmls => {
	return q.all(xmls.map(xml => parseXml(xml, "test")));
})
.then(() => drugQueries.findAll())
.then(drugs => {
	return drugs.map(drug => {
		return drug.additionalInfos.map(additionalInfo => {
			return {
				additionalInfo: additionalInfo,
				drug: drug
			}
		});
	}).reduce((prev, curr) => prev.concat(curr), []);
})
.then(addInfosWithDrugs => {
	let promise = q.when({});

	addInfosWithDrugs.forEach(addInfoWithDrug => {
		let additionalInfo = addInfoWithDrug.additionalInfo;

		promise = promise.then(() => parseWarnings(additionalInfo.text));

		return promise.then(result => {
			let drug 			 = addInfoWithDrug.drug,
				keywords 		 = result.keywords,
				interactionDrugs = result.interactionDrugs,
				reDrugName       = new RegExp(drug.name, "i");

			let filteredDrugs = interactionDrugs.filter(d => {
				let containsDrugName       = reDrugName.exec(d),
					reInteractionDrugName  = new RegExp(d, "i"),
					containsIngredientName = drug.ingredients.some(ingredient => reInteractionDrugName.exec(ingredient.name));

				// allow ingredients to be included because it may have a DDI effect with the current drug
				return !containsDrugName; // && !containsIngredientName;
			});

			return drugQueries.update(drug._id, additionalInfo._id, keywords, filteredDrugs).then(() => {
				return q.all(keywords.map(keyword => findingQueries.save(keyword.candidatePreferred, keyword.semTypes)));
			});;
		})
	});

	return promise;
})
.then(() => process.send({ success: true }))
.catch(() => process.send({ success: false }));
