"use strict";

const dom        	= require("xmldom").DOMParser,
	  xpath      	= require("xpath"),
	  q          	= require("q"),
	  child_process = require("child_process"),
	  keywordModel	= require("../db/keyword.model"),
	  metamapPath	= "/home/zoliqa/Downloads/public_mm/bin/metamap14",
	  metamapArgs	= "-J sosy,dsyn,orch,phsu,inpo -g --XMLf"; // "-J sosy,dsyn,orch,phsu,inpo,patf --XMLf";

function parseWarnings(text) {
	let echo      = child_process.spawn("echo", [text]),
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

				parseXml(xmlResult).then(deferred.resolve, deferred.reject);
			}
		}
	});

	return deferred.promise;
}

function parseXml(xml) {
	let doc 	 		 = new dom().parseFromString(xml),
		_PhrasesElements = xpath.select("//Phrases", doc),
		keywords 	     = [],
		interactionDrugs = [];

	_PhrasesElements.forEach(_PhrasesElement => {
		let _CandidateElements = xpath.select(".//Candidate", _PhrasesElement),
			drugs 			   = [],
			phraseText         = xpath.select("string(./parent::Utterance/UttText)", _PhrasesElement);

		_CandidateElements.forEach(_CandidateElement => {
			let candidateMatched   = xpath.select("string(./CandidateMatched)", _CandidateElement),
				candidatePreferred = xpath.select("string(./CandidatePreferred)", _CandidateElement),
				_SemTypeElements   = xpath.select("./SemTypes/SemType", _CandidateElement),
				semTypes		   = [];

			_SemTypeElements.forEach(_SemTypeElement => {
				let semType = xpath.select("string(.)", _SemTypeElement);

				semTypes.push(semType);
			});

			if (semTypes.indexOf("phsu") > -1 || semTypes.indexOf("orch") > -1) {
				drugs.push(candidatePreferred);
			}
			else {
				let keyword = new keywordModel.Keyword({
					candidateMatched: candidateMatched,
					candidatePreferred: candidatePreferred,
					semTypes: semTypes
				});

				keywords.push(keyword);
			}
		});

		if (drugs.length > 0 && keywords.length > 0 || drugs.length > 0 && attemptRegexMatch(phraseText))
			[].push.apply(interactionDrugs, drugs);
	});

	return q.resolve({
		keywords: keywords,
		interactionDrugs: interactionDrugs
	});
}

function attemptRegexMatch(phraseText) {
	return !!/concomitant|coadministration/i.exec(phraseText);
}

function parseXml2(xml) {
	let doc 			   = new dom().parseFromString(xml),
		_CandidateElements = xpath.select("//Candidate", doc),
		keywords 		   = [];

	_CandidateElements.forEach(_CandidateElement => {
		let candidateMatched   = xpath.select("string(./CandidateMatched)", _CandidateElement),
			candidatePreferred = xpath.select("string(./CandidatePreferred)", _CandidateElement),
			_SemTypeElements   = xpath.select("./SemTypes/SemType", _CandidateElement),
			semTypes		   = [];

		_SemTypeElements.forEach(_SemTypeElement => {
			let semType = xpath.select("string(.)", _SemTypeElement);

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
