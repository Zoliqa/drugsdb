
define([
	"angular", 
	"dexie",
	"app/common/cache.service",
	"app/common/db.service",
	"app/common/utility.service"], 
	function (angular, 
			  Dexie,
			  cacheService,
			  dbService,
			  utilityService) {
	
		angular.module("common", [])
			.factory("cacheService", cacheService)
			.factory("dbService", dbService)
			.factory("utilityService", utilityService)
			.constant("Dexie", Dexie);
	}
);

