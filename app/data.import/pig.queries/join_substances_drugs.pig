REGISTER /home/zoliqa/Downloads/pig/mongo-java-driver-3.2.2.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-core-1.5.0.jar;
REGISTER /home/zoliqa/Downloads/pig/mongo-hadoop-pig-1.5.0.jar;

substances = LOAD 'mongodb://localhost:27017/drugsdb.substances'
			 USING com.mongodb.hadoop.pig.MongoLoader('code:chararray, name:chararray');

drugs = LOAD 'mongodb://localhost:27017/drugsdb.drugs'
		USING com.mongodb.hadoop.pig.MongoLoader('name:chararray, producer:chararray, ingredients:chararray');

drugs_substances = FOREACH drugs GENERATE name, producer, FLATTEN(STRSPLITTOBAG(ingredients, ',', 0)) as ingredient_code;

substances_drugs = JOIN substances BY code, drugs_substances BY ingredient_code;

grouped = GROUP substances_drugs BY code;

DESCRIBE grouped;

projected = FOREACH grouped GENERATE group AS substance_code, BagToString(substances_drugs.drugs_substances::name, ',') AS drug_names;

--DUMP projected;

STORE projected INTO 'mongodb://localhost:27017/drugsdb.substance_drugs' USING com.mongodb.hadoop.pig.MongoStorage();
