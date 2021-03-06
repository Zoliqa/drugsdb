﻿define([], function () {

	function adminService($http, $q) {
		var service = {
			importData: importData
		};

		return service;

		function importData() {
			var deferred = $q.defer();

			$http.post("/admin/import").then(function (result) {
				deferred.resolve(result.data);
			}, deferred.reject);

			return deferred.promise;
		}
	}

	return adminService;
});
