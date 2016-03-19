define([
	"angular",
	"uiBootstrapTpls",
	"bootstrap",
	"offline",
	"offlineSimulateUI",
	// "app/main/main.module",
	"app/users/users.module",
	"app/widgets/widgets.module",
	"app/common/common.module"],
	function (angular,
			  uiBootstrapTpls,
			  bootstrap,
			  offline,
			  offlineSimulateUI,
			  // mainModule,
			  usersModule,
			  widgetsModule,
			  commonModule) {

		var drugsdb = angular.module("drugsdb", ["ngRoute", "ui.bootstrap", "users", "widgets", "common"]);

		angular.bootstrap(document, ["drugsdb"]);
	}
);
