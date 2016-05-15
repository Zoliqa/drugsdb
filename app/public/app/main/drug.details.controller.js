define([], function () {

	function DrugDetailsController($uibModalInstance, _, drug, termService) {
		var vm = this,
			semTypes = ["sosy", "dsyn", "inpo", "patf"];

		this.drug = drug;
		this.close = close;
		this.getTypeDescriptions = getTypeDescriptions;

		(function init() {
			_.each(drug.additionalInfos, function (additionalInfo) {
				additionalInfo.keywords = _.filter(additionalInfo.keywords, function (keyword) {
					if (semTypes.indexOf(keyword.semTypes[0]) > -1) {
						termService.search(keyword.candidatePreferred).then(function (result) {
							keyword.description = result.description;
						});

						return true;
					}

					return false;
				});
			});
		})();

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

					case "inpo":
						description = "injury or poisoning";
						break;

					case "patf":
						description = "pathological function";
						break;
				}

				return memo + (memo && ", " || "") + description;
			}, "");

			return descriptions;
		}
	}

	return DrugDetailsController;
});
