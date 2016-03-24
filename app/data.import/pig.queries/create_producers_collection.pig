REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

-- REGISTER 'udfs/create_substances_bag.js' USING javascript AS js;
REGISTER '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/udfs/create_substances_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('name: chararray, producer_id: chararray, producer_name: chararray, ingredients');

drugs_flat = FOREACH drugs GENERATE name, producer_id, producer_name, js.createSubstancesBag(ingredients) AS ingredients:{t:(id, name, code)};

producers_grouped = GROUP drugs_flat BY producer_id;

producers_drugs = FOREACH producers_grouped GENERATE MIN(drugs_flat.producer_id) AS producer_id,
													 MIN(drugs_flat.producer_name) AS producer_name,
													 drugs_flat.(name, ingredients) AS drugs:{t:(name, ingredients)};

STORE producers_drugs INTO 'mongodb://localhost:27017/drugsdb.producers' USING com.mongodb.hadoop.pig.MongoStorage();
