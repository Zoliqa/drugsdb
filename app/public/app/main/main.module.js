define([
	"angular",
	"angularRoute",
	"underscore",
	"app/main/pageheader.controller",
	"app/main/search.controller",
	"app/main/history.controller",
	"app/main/drug.details.controller",
	"app/main/services/search.all.service",
	"app/main/services/search.drug.service",
	"app/main/services/search.producer.service",
	"app/main/services/search.substance.service",
	"app/main/services/search.entry.service",
	"app/main/services/dbpedia.service",
	"app/main/main.config",
	"app/main/main.run"],
	function (angular,
			  angularRoute,
			  _,
			  PageHeaderController,
			  SearchController,
			  HistoryController,
			  DrugDetailsController,
			  searchAllService,
			  searchDrugService,
			  searchProducerService,
			  searchSubstanceService,
			  searchEntryService,
			  dbpediaService,
			  mainConfig,
			  mainRun) {

		angular.module("main", ["ngRoute"])
			.controller("PageHeaderController", PageHeaderController)
			.controller("SearchController", SearchController)
			.controller("HistoryController", HistoryController)
			.controller("DrugDetailsController", DrugDetailsController)
			.factory("searchAllService", searchAllService)
			.factory("searchDrugService", searchDrugService)
			.factory("searchProducerService", searchProducerService)
			.factory("searchSubstanceService", searchSubstanceService)
			.factory("searchEntryService", searchEntryService)
			.factory("dbpediaService", dbpediaService)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(mainConfig)
			.run(mainRun);
	}
);
