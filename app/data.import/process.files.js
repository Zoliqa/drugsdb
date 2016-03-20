"use strict";

const fs	   = require("fs"),
	  q	       = require("q"),
	  AdmZip   = require("adm-zip"),
	  dom      = require("xmldom").DOMParser,
	  xpath    = require("xpath"),
	  parseXml = require("./drug.xml.parser.js"),
	  connection = require("../db/connection"),
	  dirname  = process.argv[2];

fs.readdir(dirname, (err, files) => {
	files.forEach(file => {
		if (file.endsWith(".zip")) {
			let zip = new AdmZip(dirname + "/" + file);

			zip.getEntries().forEach(zipEntry => {
				if (zipEntry.entryName.endsWith(".xml")) {
					let xml = zip.readAsText(zipEntry.entryName);

					process.send(zipEntry.entryName);

					let p = parseXml(xml, zipEntry.entryName);

					p.then(() => console.log("done"), () => console.log("error"));

					// zip.readAsTextAsync(zipEntry, xml => {
					// 	parseXml(xml);
					// });
				}
			});
		}
	});
});

// function processFiles(dirName) {
// 	return q.nfcall(fs.readdir, dirname).then(files => {
// 		files.forEach(file => {
// 			if (file.endsWith(".zip")) {
// 				var zip = new AdmZip(dirname + "/" + file);
//
// 				zip.getEntries().forEach(zipEntry => {
// 					if (zipEntry.entryName.endsWith(".xml")) {
// 						// console.log(file);
//
// 						let xml = zip.readAsText(zipEntry.entryName);
//
// 						console.log(zipEntry.entryName);
//
// 						// parseXml(xml, zipEntry.entryName);
//
// 						// zip.readAsTextAsync(zipEntry, xml => {
// 						// 	parseXml(xml);
// 						// });
// 					}
// 				});
// 			}
// 		});
// 	});
// }
