REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

--REGISTER 'udfs/create_substances_bag.js' USING javascript AS js;
REGISTER '/home/zoliqa/Documents/drugsdb/app/data.import/pig.queries/udfs/create_substances_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('name: chararray, producer_id: chararray, producer_name: chararray, ingredients');

drugs_flat = FOREACH drugs GENERATE name, producer_id, producer_name, FLATTEN(js.createSubstancesBag(ingredients)) AS (substance_id, substance_name, substance_code);

substances_grouped = GROUP drugs_flat BY substance_code;

substances_drugs = FOREACH substances_grouped GENERATE MIN(drugs_flat.substance_name) AS name,
													   group AS code,
													   drugs_flat.(name, producer_id, producer_name) AS drugs:{t:(name, producer_id, producer_name)};

STORE substances_drugs INTO 'mongodb://localhost:27017/drugsdb.substances' USING com.mongodb.hadoop.pig.MongoStorage();
