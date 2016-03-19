define([
	"angular",
	"angularRoute",
	"underscore",
	"app/main/pageheader.controller",
	"app/main/search.controller",
	"app/main/main.config",
	"app/main/main.run"],
	function (angular,
			  angularRoute,
			  _,
			  PageHeaderController,
			  SearchController,
			  mainConfig,
			  mainRun) {

		angular.module("main", ["ngRoute"])
			.controller("PageHeaderController", PageHeaderController)
			.controller("SearchController", SearchController)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(mainConfig)
			.run(mainRun);
	}
);
