"use strict";

const fs	    = require("fs"),
	  q	     	= require("q"),
	  AdmZip    = require("adm-zip"),
	  dom       = require("xmldom").DOMParser,
	  xpath     = require("xpath"),
	  parseXml  = require("./drug.xml.parser.js");

function processFiles(dirName) {
	return q.nfcall(fs.readdir, dirname).then(files => {
		files.forEach(file => {
			if (file.endsWith(".zip")) {
				var zip = new AdmZip(dirname + "/" + file);

				zip.getEntries().forEach(zipEntry => {
					if (zipEntry.entryName.endsWith(".xml")) {
						// console.log(file);

						let xml = zip.readAsText(zipEntry.entryName);

						parseXml(xml, zipEntry.entryName);

						// zip.readAsTextAsync(zipEntry, xml => {
						// 	parseXml(xml);
						// });
					}
				});
			}
		});
	});
}

module.exports = processFiles;
