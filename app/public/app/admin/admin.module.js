define([
	"angular",
	"angularRoute",
	"underscore",
	"public/app/admin/import.controller.js", // TODO: check why can't we use only app/admin...
	"app/admin/admin.service",
	"app/admin/admin.config",
	"app/admin/admin.run"],
	function (angular,
			  angularRoute,
			  _,
			  ImportController,
			  adminService,
			  adminConfig,
			  adminRun) {

		angular.module("admin", ["ngRoute"])
			.controller("ImportController", ImportController)
			.factory("adminService", adminService)
			.constant("_", _)
			.constant("UNAUTHORIZED", "UNAUTHORIZED")
			.config(adminConfig)
			.run(adminRun);
	}
);
