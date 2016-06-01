"use strict";

const fs	         = require("fs"),
	  q	             = require("q"),
	  AdmZip         = require("adm-zip"),
	  dom            = require("xmldom").DOMParser,
	  xpath    	     = require("xpath"),
	  parseXml       = require("./drug.xml.parser"),
	  connection     = require("../db/connection"),
	  Drug           = require("../db/drug.model"),
	  SubstanceModel = require("../db/substance.model"),
	  ProducerModel  = require("../db/producer.model"),
	  findingQueries = require("../db/finding.queries"),
	  parseWarnings  = require("./warnings.parser"),
	  dirname        = "/home/zoliqa/Documents/drugsdb/input/selected/";
	  //dirname    	 = process.argv[2];

let promises = [];

console.log("started");

Drug.remove({})
.then(() => SubstanceModel.Substance.remove({}))
.then(() => ProducerModel.Producer.remove({}))
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
	zipFiles.forEach(file => console.log(file));

	return zipFiles.map(file => {
		let zip = new AdmZip(file);

		return zip.getEntries().filter(entry => entry.entryName.endsWith(".xml")).map(entry => zip.readAsText(entry.entryName));
	}).reduce((prev, curr) => prev.concat(curr), []);
})
.then(xmls => {
	return q.all(xmls.map(xml => parseXml(xml, "test")));
})
.then(() => {
	let promise = q.when({});

	Drug.find({}).then(drugs => {
		drugs.forEach(drug => {
			console.log(drug.name);

			drug.additionalInfos.forEach(additionalInfo => {
				promise = promise.then(() => {
					return parseWarnings(additionalInfo.text).then(result => {
						let keywords 		 = result.keywords,
							interactionDrugs = result.interactionDrugs,
							reDrugName       = new RegExp(drug.name, "i");

						let filteredDrugs = interactionDrugs.filter(d => {
							let containsDrugName       = reDrugName.exec(d),
								reInteractionDrugName  = new RegExp(d, "i"),
								containsIngredientName = drug.ingredients.some(ingredient => reInteractionDrugName.exec(ingredient.name));

							// allow ingredients to be included because it may have a DDI effect with the current drug
							return !containsDrugName; // && !containsIngredientName;
						});

						return Drug.findOneAndUpdate({
							_id: drug._id,
							"additionalInfos._id": additionalInfo._id
						}, {
							$set: {
								"additionalInfos.$.keywords": keywords,

							},
							$addToSet: {
								interactionDrugs: { $each: filteredDrugs }
							}
						}).then(() => {
							var promises = keywords.map(keyword => findingQueries.save(keyword.candidatePreferred, keyword.semTypes));

							return q.all(promises);
						});
					});
				});
			});
		});

		promise.then(() => process.send({ success: true })).catch(() => process.send({ success: false }));
	});
})
.catch(ex => {
	console.log(ex);
});

return;

Drug.remove({})
.then(() => SubstanceModel.Substance.remove({}))
.then(() => ProducerModel.Producer.remove({}))
.then(() => {
	fs.readdir(dirname, (err, files) => {
		console.log("readdir started");

		files.forEach(file => {
			if (file.endsWith(".zip")) {
				let zip = new AdmZip(dirname + "/" + file);

				zip.getEntries().forEach(zipEntry => {
					if (zipEntry.entryName.endsWith(".xml")) {
						let xml = zip.readAsText(zipEntry.entryName);
						let promise = parseXml(xml, zipEntry.entryName);

						promises.push(promise);

						// zip.readAsTextAsync(zipEntry, xml => {
						// 	parseXml(xml);
						// });
					}
				});
			}
		});

		let promise = q.when({});

		q.all(promises).then(() => {
			Drug.find({}).then(drugs => {
				drugs.forEach(drug => {
					console.log(drug.name);

					drug.additionalInfos.forEach(additionalInfo => {
						promise = promise.then(() => {
							return parseWarnings(additionalInfo.text).then(result => {
								let keywords 		 = result.keywords,
									interactionDrugs = result.interactionDrugs,
									reDrugName       = new RegExp(drug.name, "i");

							    let filteredDrugs = interactionDrugs.filter(d => {
									let containsDrugName       = reDrugName.exec(d),
										reInteractionDrugName  = new RegExp(d, "i"),
										containsIngredientName = drug.ingredients.some(ingredient => reInteractionDrugName.exec(ingredient.name));

									// allow ingredients to be included because it may have a DDI effect with the current drug
									return !containsDrugName; // && !containsIngredientName;
								});

								return Drug.findOneAndUpdate({
									_id: drug._id,
									"additionalInfos._id": additionalInfo._id
								}, {
									$set: {
										"additionalInfos.$.keywords": keywords,

									},
									$addToSet: {
										interactionDrugs: { $each: filteredDrugs }
									}
								}).then(() => {
									var promises = keywords.map(keyword => findingQueries.save(keyword.candidatePreferred));

									return q.all(promises);
								});
							});
						});
					});
				});

				promise.then(() => process.send({ success: true })).catch(() => process.send({ success: false }));
			});
		});
	});// .catch(() => process.send({ success: false }));
}).catch((ex) => {
	console.log(ex);

	process.send({ success: false });
});
