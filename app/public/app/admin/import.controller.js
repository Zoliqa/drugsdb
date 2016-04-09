define([], function () {

	function ImportController($scope, io, adminService) {
		var vm = this;

		this.importData = importData;
		this.progressValue = 0;
		this.maxProgressValue = 1;

		function importData() {
			adminService.importData().then(function (result) {
				if (result.started) {
					vm.progressValue = 0.01;

					var socket = io().connect();

					socket.on("progress", function (amount) {
						$scope.$apply(function () {
							vm.progressValue += amount;

							if (vm.progressValue >= vm.maxProgressValue)
								socket.emit("forceDisconnect");
						});
					});
				}
			}, function () {
				alert("Error occurred");
			});
		}
	}

	return ImportController;
});
