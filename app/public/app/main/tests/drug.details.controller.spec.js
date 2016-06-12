define(["angularMocks", "underscore", "app/main/drug.details.controller"], function (angularMocks, _, DrugDetailsController) {

	describe("DrugDetailsController", function () {
		var $q,
			$rootScope,
			$uibModalInstanceMock,
			termServiceMock,
			drugDetailsController,
			drug;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			$uibModalInstanceMock = {
				dismiss: function () {}
			};

			termServiceMock = {
				search: function () {}
			};

			drug = {};
		}));

		function createDrugDetailsController() {
			drugDetailsController = new DrugDetailsController($uibModalInstanceMock, _, drug, termServiceMock);
		}

		it("should be defined", function () {
			expect(DrugDetailsController).not.toBeNull();
		});

		it("should filter the correct additional infos for the given drug", function () {
			drug = {
				additionalInfos: [{
					keywords: [{
						semTypes: ["sosy"],
						candidatePreferred: "Candidate1"
					}, {
						semTypes: ["sometingelse"],
						candidatePreferred: "Candidate2"
					}]
				}]
			};

			spyOn(termServiceMock, "search").and.returnValue($q.reject({}));

			createDrugDetailsController();

			expect(termServiceMock.search.calls.count()).toBe(1);
		});

		it("should set the keyword description correctly", function () {
			drug = {
				additionalInfos: [{
					keywords: [{
						semTypes: ["sosy"],
						candidatePreferred: "Candidate1"
					}]
				}]
			};

			spyOn(termServiceMock, "search").and.returnValue($q.when({
				description: "TheResult"
			}));

			createDrugDetailsController();

			$rootScope.$apply();

			expect(drug.additionalInfos[0].keywords[0].description).toBe("TheResult");
		});

		it("should close the dialog", function () {
			spyOn($uibModalInstanceMock, "dismiss");

			createDrugDetailsController();

			drugDetailsController.close();

			expect($uibModalInstanceMock.dismiss).toHaveBeenCalled();
		});

		it("should show the correct type descriptions", function () {
			createDrugDetailsController();

			var descriptions = drugDetailsController.getTypeDescriptions(["sosy"]);

			expect(descriptions).toBe("sign or symptom");

			var descriptions = drugDetailsController.getTypeDescriptions(["dsyn"]);

			expect(descriptions).toBe("disease or syndrome");

			var descriptions = drugDetailsController.getTypeDescriptions(["orch"]);

			expect(descriptions).toBe("organic chemical");

			var descriptions = drugDetailsController.getTypeDescriptions(["phsu"]);

			expect(descriptions).toBe("pharmacologic substance");

			var descriptions = drugDetailsController.getTypeDescriptions(["inpo"]);

			expect(descriptions).toBe("injury or poisoning");

			var descriptions = drugDetailsController.getTypeDescriptions(["patf"]);

			expect(descriptions).toBe("pathological function");
		});
	});
});
