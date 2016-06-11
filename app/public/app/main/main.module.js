define([
	"angular",
	"angularRoute",
	"underscore",
	"jquery",
	"app/main/pageheader.controller",
	"app/main/search.controller",
	"app/main/history.controller",
	"app/main/drug.details.controller",
	"app/main/services/search.all.service",
	"app/main/services/search.drug.service",
	"app/main/services/search.producer.service",
	"app/main/services/search.substance.service",
	"app/main/services/search.entry.service",
	"app/main/services/term.service",
	"app/main/services/term.dbpedia.service",
	"app/main/services/term.medlineplus.service",
	"app/main/services/levenshtein.distance.service",
	"app/main/main.config",
	"app/main/main.run"],
	function (angular,
			  angularRoute,
			  _,
			  jquery,
			  PageHeaderController,
			  SearchController,
			  HistoryController,
			  DrugDetailsController,
			  searchAllService,
			  searchDrugService,
			  searchProducerService,
			  searchSubstanceService,
			  searchEntryService,
			  termService,
			  termDbpediaService,
			  termMedlinePlusService,
			  levenhsteinDistanceService,
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
			.factory("termService", termService)
			.factory("termDbpediaService", termDbpediaService)
			.factory("termMedlinePlusService", termMedlinePlusService)
			.factory("levenhsteinDistanceService", levenhsteinDistanceService)
			.constant("_", _)
			.constant("jquery", jquery)
			.constant("Offline", Offline) //???
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.constant("USER_LOGGED_IN", "USER_LOGGED_IN") // ???
			.config(mainConfig)
			.run(mainRun);
	}
);
