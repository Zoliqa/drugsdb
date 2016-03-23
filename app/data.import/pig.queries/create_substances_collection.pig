REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

REGISTER 'udfs/create_substances_bag.js' USING javascript AS js;

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
	   	USING com.mongodb.hadoop.pig.MongoLoader('id: chararray, name: chararray, producer: chararray, ingredients', 'id');

DESCRIBE drugs;

drugs_flat = FOREACH drugs GENERATE id, name, producer, FLATTEN(js.createSubstancesBag(ingredients)) AS (substance_id, substance_name, substance_code);

DUMP drugs_flat;

substances_grouped = GROUP drugs_flat BY substance_code;

DUMP substances_grouped;

substances_drugs = FOREACH substances_grouped GENERATE MIN(drugs_flat.substance_id) AS substance_id,
													   MIN(drugs_flat.substance_name) AS name,
													   group AS code,
													   drugs_flat.(id, name, producer) AS drugs:{t:(id, name, producer)};

DUMP substances_drugs;

STORE substances_drugs INTO 'mongodb://localhost:27017/drugsdb.substances' USING com.mongodb.hadoop.pig.MongoStorage();
