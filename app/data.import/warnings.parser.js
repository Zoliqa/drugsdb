"use strict";

const dom        	= require("xmldom").DOMParser,
	  xpath      	= require("xpath"),
	  q          	= require("q"),
	  child_process = require("child_process"),
	  keywordModel	= require("../db/keyword.model"),
	  metamapPath	= "/home/zoliqa/Downloads/public_mm/bin/metamap14",
	  metamapArgs	= "-J sosy,dsyn,orch,phsu --XMLf";

function parseWarnings(additionalInfo) {
	let echo      = child_process.spawn("echo", [additionalInfo.text]),
		metamap   = child_process.spawn(metamapPath, [metamapArgs]),
		xmlResult = "",
		xmlParsed = false,
		deferred  = q.defer();

	echo.stdout.on("data", data => {
		metamap.stdin.write(data);
	});

	echo.stderr.on("data", data => {
		console.log(`echo stderr: ${data}`);
	});

	echo.on("close", code => {
		if (code !== 0)
			console.log(`echo process exited with code ${code}`);

		metamap.stdin.end();
	});

	metamap.stdout.on("data", data => {
		xmlResult += data.toString();
	});

	metamap.stderr.on("data", data => {
		console.log(`metamap stderr: ${data}`);
	});

	metamap.on("close", code => {
		if (code !== 0)
			console.log(`metamap process exited with code ${code}`);
		else {
			if (!xmlParsed) {
				xmlParsed = true;

				parseXml(xmlResult).then(keywords => {
					additionalInfo.keywords = keywords;

					deferred.resolve();
				}, deferred.reject);
			}
		}
	});

	return deferred.promise;
}

function parseXml(xml) {
	let doc 			   = new dom().parseFromString(xml),
		_CandidateElements = xpath.select("//Candidate", doc),
		keywords 		   = [];

	_CandidateElements.forEach(_CandidateElement => {
		let candidateMatched   = xpath.select("string(./CandidateMatched)", _CandidateElement),
			candidatePreferred = xpath.select("string(./CandidatePreferred)", _CandidateElement),
			_SemTypesElements  = xpath.select("./SemTypes", _CandidateElement),
			semTypes		   = [];

		_SemTypesElements.forEach(_SemTypesElement => {
			let semType = xpath.select("string(./SemType)", _SemTypesElement);

			semTypes.push(semType);
		});

		let keyword = new keywordModel.Keyword({
			candidateMatched: candidateMatched,
			candidatePreferred: candidatePreferred,
			semTypes: semTypes
		});

		keywords.push(keyword);
	});

	return q.resolve(keywords);
}

module.exports = parseWarnings;
