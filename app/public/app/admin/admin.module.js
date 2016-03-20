define([
	"angular",
	"angularRoute",
	"underscore",
	"public/app/admin/import.controller.js", // TODO: check why can't we use only app/admin...
	"app/admin/admin.config",
	"app/admin/admin.run"],
	function (angular,
			  angularRoute,
			  _,
			  ImportController,
			  adminConfig,
			  adminRun) {

		angular.module("admin", ["ngRoute"])
			.controller("ImportController", ImportController)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(adminConfig)
			.run(adminRun);
	}
);
