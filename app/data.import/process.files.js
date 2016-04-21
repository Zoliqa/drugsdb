"use strict";

const fs	         = require("fs"),
	  q	             = require("q"),
	  AdmZip         = require("adm-zip"),
	  dom            = require("xmldom").DOMParser,
	  xpath    	     = require("xpath"),
	  parseXml       = require("./drug.xml.parser"),
	  connection     = require("../db/connection"),
	  Drug           = require("../db/drug.model"),
	  substanceModel = require("../db/substance.model"),
	  producerModel  = require("../db/producer.model"),
	  parseWarnings  = require("./warnings.parser"),
	  //dirname        = "/home/zoliqa/Documents/drugsdb/input/selected2/";
	  dirname    = process.argv[2];

let promises = [];

Drug.remove({})
.then(() => substanceModel.Substance.remove({}))
.then(() => producerModel.Producer.remove({}))
.then(() => {
	fs.readdir(dirname, (err, files) => { console.log("readdir started")
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
							return parseWarnings(additionalInfo.text).then(keywords => {
								return Drug.findOneAndUpdate({
									_id: drug._id,
									"additionalInfos._id": additionalInfo._id
								}, {
									$set: {
										"additionalInfos.$.keywords": keywords
									}
								});
							});
						});
					});
				});

				promise.then(() => process.send({ success: true })).catch(() => process.send({ success: false }));
			});
		});
	}).catch(() => process.send({ success: false }));
});
