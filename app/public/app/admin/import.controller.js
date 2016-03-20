define([], function () {

	function ImportController(adminService) {
		var vm = this;

		this.importData = importData;

		function importData() {
			adminService.importData().then(function (result) {
				alert(result);
			}, function () {
				alert("Error occurred");
			});
		}
	}

	return ImportController;
});
