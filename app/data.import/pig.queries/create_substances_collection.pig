REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

--REGISTER 'udfs/create_substances_bag.js' USING javascript AS js;
REGISTER '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/udfs/create_substances_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('name: chararray, producerId: chararray, producerName: chararray, ingredients');

drugsFlat = FOREACH drugs GENERATE name, producerId, producerName, FLATTEN(js.createSubstancesBag(ingredients)) AS (substanceId, substanceName, substanceCode);

substancesGrouped = GROUP drugsFlat BY substanceCode;

substancesDrugs = FOREACH substancesGrouped GENERATE MIN(drugsFlat.substanceName) AS name,
													 group AS code,
													 drugsFlat.(name, producerId, producerName) AS drugs:{t:(name, producerId, producerName)};

STORE substancesDrugs INTO 'mongodb://localhost:27017/drugsdb.substances' USING com.mongodb.hadoop.pig.MongoStorage();
