define([], function () {

	function DrugDetailsController($uibModalInstance, drug) {
		var vm = this;

		this.drug = drug;
		this.close = close;

		function close() {
			$uibModalInstance.dismiss();
		}
	}

	return DrugDetailsController;
});
