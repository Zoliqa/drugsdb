"use strict";

const fs	     = require("fs"),
	  q	         = require("q"),
	  AdmZip     = require("adm-zip"),
	  dom        = require("xmldom").DOMParser,
	  xpath    	 = require("xpath"),
	  parseXml   = require("./drug.xml.parser"),
	  connection = require("../db/connection"),
	  Drug       = require("../db/drug.model"),
	  substance  = require("../db/substance.model"),
	  producer   = require("../db/producer.model"),
	  dirname    = process.argv[2]; //"/home/zoliqa/Documents/drugsdb/input/selected/";

let promises = [];

Drug.remove({})
.then(() => substance.Substance.remove({}))
.then(() => producer.Producer.remove({}))
.then(() => {
	fs.readdir(dirname, (err, files) => {
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

		q.all(promises).then(() => process.send({ success: true }), () => process.send({ success: false }));
	});
});
