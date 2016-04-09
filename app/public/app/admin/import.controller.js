define([], function () {

	function ImportController(io, adminService) {
		var vm = this;

		this.importData = importData;

		function importData() {
			adminService.importData().then(function (result) {
				alert(result);

				var socket = io().connect();

				socket.on("progress", function (amount) {
					console.log(amount);
				});
			}, function () {
				alert("Error occurred");
			});
		}
	}

	return ImportController;
});
