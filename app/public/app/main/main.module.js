define([
	"angular",
	"angularRoute",
	"underscore",
	"app/main/pageheader.controller",
	"app/main/search.controller",
	"app/main/search.all.service",
	"app/main/search.drug.service",
	"app/main/search.producer.service",
	"app/main/search.substance.service",
	"app/main/main.config",
	"app/main/main.run"],
	function (angular,
			  angularRoute,
			  _,
			  PageHeaderController,
			  SearchController,
			  searchAllService,
			  searchDrugService,
			  searchProducerService,
			  searchSubstanceService,
			  mainConfig,
			  mainRun) {

		angular.module("main", ["ngRoute"])
			.controller("PageHeaderController", PageHeaderController)
			.controller("SearchController", SearchController)
			.factory("searchAllService", searchAllService)
			.factory("searchDrugService", searchDrugService)
			.factory("searchProducerService", searchProducerService)
			.factory("searchSubstanceService", searchSubstanceService)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(mainConfig)
			.run(mainRun);
	}
);
