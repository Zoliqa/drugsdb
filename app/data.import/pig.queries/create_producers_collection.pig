REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

-- REGISTER 'udfs/create_substances_bag.js' USING javascript AS js;
REGISTER '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/udfs/create_substances_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('name: chararray, producerId: chararray, producerName: chararray, ingredients');

drugs2 = FOREACH drugs GENERATE name, producerId, producerName, js.createSubstancesBag(ingredients) AS ingredients:{t:(id, name, code)};

producersGrouped = GROUP drugs2 BY producerId;

producersDrugs = FOREACH producersGrouped GENERATE MIN(drugs2.producerId) AS producerId,
												   MIN(drugs2.producerName) AS producerName,
												   drugs2.(name, ingredients) AS drugs:{t:(name, ingredients)};

STORE producersDrugs INTO 'mongodb://localhost:27017/drugsdb.producers' USING com.mongodb.hadoop.pig.MongoStorage(); 
