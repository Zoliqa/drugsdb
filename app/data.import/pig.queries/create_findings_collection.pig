REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

REGISTER '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/udfs/create_keywords_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('name: chararray, additionalInfos');

drugsFlat = FOREACH drugs GENERATE name, FLATTEN(js.createKeywordsBag(additionalInfos)) AS (candidateMatched, candidatePreferred, semType);

drugsFlatWithGroup = FOREACH drugsFlat GENERATE name, candidateMatched, candidatePreferred, semType, CONCAT(CONCAT(candidateMatched, candidatePreferred), semType) AS groupName;

drugsFlatWithGroupDistinct = DISTINCT drugsFlatWithGroup;

findingsGrouped = GROUP drugsFlatWithGroupDistinct BY groupName;

findingsWithDrugs = FOREACH findingsGrouped GENERATE MIN(drugsFlatWithGroupDistinct.candidateMatched) AS candidateMatched,
													 MIN(drugsFlatWithGroupDistinct.candidatePreferred) AS candidatePreferred,
													 MIN(drugsFlatWithGroupDistinct.semType) AS semType,
													 drugsFlatWithGroupDistinct.(name) AS drugs:{t:(name)};

STORE findingsWithDrugs INTO 'mongodb://localhost:27017/drugsdb.findings' USING com.mongodb.hadoop.pig.MongoStorage();

/*
--DUMP drugsFlat;
--STORE drugsFlat INTO '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/result.txt' USING PigStorage(';');

drugsFlatDistinct = DISTINCT drugsFlat;

--DUMP drugsFlatDistinct;
--STORE drugsFlatDistinct INTO '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/result-distinct.txt' USING PigStorage(';');

findingsGrouped = GROUP drugsFlatDistinct BY candidatePreferred;

findingsWithDrugs = FOREACH findingsGrouped GENERATE MIN(drugsFlatDistinct.candidateMatched) AS candidateMatched,
													 group AS candidatePreferred,
													 MIN(drugsFlatDistinct.semType) AS semType,
													 drugsFlatDistinct.(name) AS drugs:{t:(name)};

DESCRIBE findingsWithDrugs;

STORE findingsWithDrugs INTO 'mongodb://localhost:27017/drugsdb.findings' USING com.mongodb.hadoop.pig.MongoStorage();*/
