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

counted = FOREACH findingsGrouped GENERATE group, drugsFlatWithGroupDistinct, COUNT(drugsFlatWithGroupDistinct.candidateMatched) AS count;

ordered = ORDER counted BY count DESC;

DESCRIBE ordered;

findingsWithDrugs = FOREACH ordered GENERATE MIN(drugsFlatWithGroupDistinct.candidateMatched) AS candidateMatched,
											 MIN(drugsFlatWithGroupDistinct.candidatePreferred) AS candidatePreferred,
											 MIN(drugsFlatWithGroupDistinct.semType) AS semType,
											 drugsFlatWithGroupDistinct.(name) AS drugs:{t:(name)},
											 count AS drugsCount;

DESCRIBE findingsWithDrugs;

STORE findingsWithDrugs INTO 'mongodb://localhost:27017/drugsdb.findings' USING com.mongodb.hadoop.pig.MongoStorage();

-- STORE findingsWithDrugs INTO '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/findings-stats.txt' USING PigStorage(';');
