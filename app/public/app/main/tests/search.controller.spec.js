define(["angularMocks", "app/main/search.controller"], function (angularMocks, SearchController) {

	describe("SearchController", function () {
		var $q,
			$rootScope,
			locationMock,
			injectorMock,
			uibModalMock,
			searchEntryServiceMock,
			searchAllServiceMock = {},
			searchDrugServiceMock,
			searchProducerServiceMock,
			searchSubstanceServiceMock,
			searchController;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			locationMock = {
				search: function () {
					return {
						username: "username"
					}
				},
				path: function () {}
			};

			injectorMock = {
				get: function () {}
			}

			uibModalMock = {
				open: function () {}
			};

			searchEntryServiceMock = {
				save: function () {}
			};

			searchDrugServiceMock = {
				search: function () {}
			};

			searchProducerServiceMock = {
				search: function () {}
			};

			searchSubstanceServiceMock = {
				search: function () {}
			};
		}));

		function createSearchController() {
			searchController = new SearchController(
				$rootScope,
				locationMock,
				injectorMock,
				uibModalMock,
				searchEntryServiceMock,
				searchAllServiceMock,
				searchDrugServiceMock,
				searchProducerServiceMock,
				searchSubstanceServiceMock);
		}

		it("should be defined", function () {
			expect(SearchController).toBeDefined();
		});

		it("should search on init if type is set to 'searchDrugService' and term is set to 'DragonTabs'", function () {
			spyOn(locationMock, "search").and.returnValue({
				type: "searchDrugService",
				term: "DragonTabs"
			});

			spyOn(injectorMock, "get").and.returnValue(searchDrugServiceMock);

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.reject({}));

			createSearchController();

			expect(injectorMock.get.calls.argsFor(0)[0]).toBe("searchDrugService");

			expect(searchController.searchTerm).toBe("DragonTabs");
			expect(searchController.searchService).toBe(searchDrugServiceMock);

			expect(searchDrugServiceMock.search).toHaveBeenCalled();
		});

		it("should search on init if type is set to 'searchProducerService' and term is set to 'Producer'", function () {
			spyOn(locationMock, "search").and.returnValue({
				type: "searchProducerService",
				term: "Producer"
			});

			spyOn(injectorMock, "get").and.returnValue(searchProducerServiceMock);

			spyOn(searchProducerServiceMock, "search").and.returnValue($q.reject({}));

			createSearchController();

			expect(injectorMock.get.calls.argsFor(0)[0]).toBe("searchProducerService");

			expect(searchController.searchTerm).toBe("Producer");
			expect(searchController.searchService).toBe(searchProducerServiceMock);

			expect(searchProducerServiceMock.search).toHaveBeenCalled();
		});

		it("should search on init if type is set to 'searchSubstanceService' and term is set to 'Substance'", function () {
			spyOn(locationMock, "search").and.returnValue({
				type: "searchSubstanceService",
				term: "Substance"
			});

			spyOn(injectorMock, "get").and.returnValue(searchSubstanceServiceMock);

			spyOn(searchSubstanceServiceMock, "search").and.returnValue($q.reject({}));

			createSearchController();

			expect(injectorMock.get.calls.argsFor(0)[0]).toBe("searchSubstanceService");

			expect(searchController.searchTerm).toBe("Substance");
			expect(searchController.searchService).toBe(searchSubstanceServiceMock);

			expect(searchSubstanceServiceMock.search).toHaveBeenCalled();
		});

		it("should not search for invalid search type service", function () {
			spyOn(locationMock, "search").and.returnValue({
				type: "invalidService",
				term: "Some term"
			});

			spyOn(injectorMock, "get").and.callFake(function () {
				throw new Error;
			});

			spyOn(searchSubstanceServiceMock, "search").and.returnValue($q.reject({}));

			createSearchController();

			expect(injectorMock.get.calls.argsFor(0)[0]).toBe("invalidService");

			expect(searchController.searchService).toBe(searchDrugServiceMock);

			expect(locationMock.search).toHaveBeenCalled();
			expect(locationMock.search.calls.argsFor(2)).toEqual(["type", ""]);
		});

		it("should support search by all", function () {
			createSearchController();

			searchController.searchService = searchDrugServiceMock;

			searchController.searchByAll();

			expect(searchController.searchService).toBe(searchAllServiceMock);
		});

		it("should support search by drug name", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			searchController.searchByDrug();

			expect(searchController.searchService).toBe(searchDrugServiceMock);
			expect(searchController.results).toBeFalsy();
		});

		it("should search by drug name when clicking on a drug", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.reject({}));

			searchController.handleDrugClick("DrugName");

			expect(searchController.searchService).toBe(searchDrugServiceMock);
			expect(searchController.results).toBeFalsy();
			expect(searchController.searchTerm).toBe("DrugName");

			expect(searchDrugServiceMock.search).toHaveBeenCalled();
		});

		it("should support search by producer name", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			searchController.searchByProducer();

			expect(searchController.searchService).toBe(searchProducerServiceMock);
			expect(searchController.results).toBeFalsy();
		});

		it("should search by producer name when clicking on a producer", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			spyOn(searchProducerServiceMock, "search").and.returnValue($q.reject({}));

			searchController.handleProducerClick("ProducerName");

			expect(searchController.searchService).toBe(searchProducerServiceMock);
			expect(searchController.results).toBeFalsy();
			expect(searchController.searchTerm).toBe("ProducerName");

			expect(searchProducerServiceMock.search).toHaveBeenCalled();
		});

		it("should support search by substance name", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			searchController.searchBySubstance();

			expect(searchController.searchService).toBe(searchSubstanceServiceMock);
			expect(searchController.results).toBeFalsy();
		});

		it("should search by substance name when clicking on a substance", function () {
			createSearchController();

			searchController.results = [1, 2];
			searchController.searchService = searchAllServiceMock;

			spyOn(searchSubstanceServiceMock, "search").and.returnValue($q.reject({}));

			searchController.handleSubstanceClick("SubstanceName");

			expect(searchController.searchService).toBe(searchSubstanceServiceMock);
			expect(searchController.results).toBeFalsy();
			expect(searchController.searchTerm).toBe("SubstanceName");

			expect(searchSubstanceServiceMock.search).toHaveBeenCalled();
		});

		it("should search on pressing return key", function () {
			createSearchController();

			searchController.searchService = searchDrugServiceMock;
			searchController.searchTerm = "DrugName";

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.reject({}));

			searchController.checkKey({
				keyCode: 13
			});

			expect(searchDrugServiceMock.search).toHaveBeenCalled();
		});

		it("should not search on pressing any other keys than return", function () {
			createSearchController();

			searchController.searchService = searchDrugServiceMock;
			searchController.searchTerm = "DrugName";

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.reject({}));

			searchController.checkKey({
				keyCode: 14
			});

			expect(searchDrugServiceMock.search).not.toHaveBeenCalled();

			searchController.checkKey({
				keyCode: 15
			});

			expect(searchDrugServiceMock.search).not.toHaveBeenCalled();
		});

		it("should toggle the orientation of the list", function () {
			createSearchController();

			searchController.showListVertically = false;

			searchController.toggleDisplayOfList();

			expect(searchController.showListVertically).toBe(true);

			searchController.showListVertically = true;

			searchController.toggleDisplayOfList();

			expect(searchController.showListVertically).toBe(false);
		});

		it("should reset the search results", function () {
			createSearchController();

			searchController.searchTerm = "TheTerm";
			searchController.resets = [1, 2, 3];

			searchController.reset();

			expect(searchController.searchTerm).toBeFalsy();
			expect(searchController.results).toBe(null);
		});

		it("should return the correct template name for the results", function () {
			createSearchController();

			searchDrugServiceMock.template = "TemplateName";

			searchController.searchService = searchDrugServiceMock;

			var templateName = searchController.getResultsTemplateName();

			expect(templateName).toBe("/public/app/main/results/TemplateName.html");
		});

		it("should show drug details on a dialog", function () {
			createSearchController();

			spyOn(uibModalMock, "open");

			var drug = {};

			searchController.showDrugDetails(drug);

			expect(uibModalMock.open).toHaveBeenCalled();

			var parameter = uibModalMock.open.calls.argsFor(0)[0];

			expect(parameter).toBeDefined();
			expect(parameter.templateUrl).toEqual(jasmine.stringMatching(/drug.details.html$/));
			expect(parameter.controller).toBe("DrugDetailsController");
			expect(parameter.resolve.drug()).toBe(drug);
		});

		it("should not search for empty term", function () {
			createSearchController();

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.reject({}));
			spyOn(locationMock, "search");

			searchController.searchService = searchDrugServiceMock;
			searchController.searchTerm = "";

			searchController.search();

			expect(searchDrugServiceMock.search).not.toHaveBeenCalled();
			expect(locationMock.search).not.toHaveBeenCalled();
		});

		it("should search for valid term", function () {
			createSearchController();

			var results = [1, 2, 3];

			spyOn(searchDrugServiceMock, "search").and.returnValue($q.when(results));
			spyOn(locationMock, "search");

			spyOn(searchEntryServiceMock, "save").and.returnValue({
				$promise: $q.when({})
			});

			searchController.searchService = searchDrugServiceMock;
			searchController.searchTerm = "SearchTerm";

			searchController.searchService.name = "searchDrugService";

			searchController.search();

			$rootScope.$apply();

			expect(searchDrugServiceMock.search).toHaveBeenCalled();
			expect(searchController.results).toBe(results);

			expect(searchEntryServiceMock.save).toHaveBeenCalled();
			expect(searchEntryServiceMock.save.calls.argsFor(0)[0]).toEqual({
				type: "searchDrugService",
				term: "SearchTerm",
				date: jasmine.any(Object)
			});

			expect(locationMock.search).toHaveBeenCalled();
			expect(locationMock.search.calls.argsFor(0)[0]).toEqual({
				type: "searchDrugService",
				term: "SearchTerm"
			});
		});
	});
});
