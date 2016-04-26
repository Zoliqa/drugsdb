define([], function () {

	function DrugDetailsController($uibModalInstance, _, drug, termService) {
		var vm = this;

		this.drug = drug;
		this.close = close;
		this.getTypeDescriptions = getTypeDescriptions;

		(function init() {
			_.each(drug.additionalInfos, function (additionalInfo) {
				additionalInfo.keywords = _.filter(additionalInfo.keywords, function (keyword) {
					if (keyword.semTypes[0] === "sosy" || keyword.semTypes[0] === "dsyn") {
						termService.current.then(function (termServiceCurrent) {
							termServiceCurrent.search(keyword.candidatePreferred).then(function (result) {
								keyword.description = result.description;
							});
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
				}

				return memo + (memo && ", " || "") + description;
			}, "");

			return descriptions;
		}
	}

	return DrugDetailsController;
});
