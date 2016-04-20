define([], function () {

	function DrugDetailsController($uibModalInstance, _, drug) {
		var vm = this;

		this.drug = drug;
		this.close = close;
		this.getTypeDescriptions = getTypeDescriptions;

		function close() {
			$uibModalInstance.dismiss();
		}

		function getTypeDescriptions(semTypes) {
			var descriptions = _.reduce(semTypes, function (memo, semType) {
				var description;

				switch (semType) {
					case "sosy":
						description = "sign or symptom";
						break;

					case "dsyn":
						description = "disease or syndrome";
						break;

					case "orch":
						description = "organic chemical";
						break;

					case "phsu":
						description = "pharmacologic substance";
						break;
				}

				return memo + (memo && ", " || "") + description;
			}, "");

			return descriptions;
		}
	}

	return DrugDetailsController;
});
