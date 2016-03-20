"use strict";

const fs	     = require("fs"),
	  q	         = require("q"),
	  AdmZip     = require("adm-zip"),
	  dom        = require("xmldom").DOMParser,
	  xpath    	 = require("xpath"),
	  parseXml   = require("./drug.xml.parser.js"),
	  connection = require("../db/connection"),
	  dirname    = process.argv[2];

let promises = [];

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
