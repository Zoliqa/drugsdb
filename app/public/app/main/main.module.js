define([
	"angular",
	"angularRoute",
	"underscore",
	"app/main/pageheader.controller",
	"app/main/search.controller",
	"app/main/history.controller",
	"app/main/services/search.all.service",
	"app/main/services/search.drug.service",
	"app/main/services/search.producer.service",
	"app/main/services/search.substance.service",
	"app/main/services/search.entry.service",
	"app/main/main.config",
	"app/main/main.run"],
	function (angular,
			  angularRoute,
			  _,
			  PageHeaderController,
			  SearchController,
			  HistoryController,
			  searchAllService,
			  searchDrugService,
			  searchProducerService,
			  searchSubstanceService,
			  searchEntryService,
			  mainConfig,
			  mainRun) {

		angular.module("main", ["ngRoute"])
			.controller("PageHeaderController", PageHeaderController)
			.controller("SearchController", SearchController)
			.controller("HistoryController", HistoryController)
			.factory("searchAllService", searchAllService)
			.factory("searchDrugService", searchDrugService)
			.factory("searchProducerService", searchProducerService)
			.factory("searchSubstanceService", searchSubstanceService)
			.factory("searchEntryService", searchEntryService)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(mainConfig)
			.run(mainRun);
	}
);
