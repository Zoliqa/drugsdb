define(["angularMocks", "app/main/search.controller"], function (angularMocks, SearchController) {

	describe("SearchController", function () {
		var $q,
			$rootScope,
			locationMock,
			injectorMock,
			uibModalMock = {},
			searchEntryServiceMock = {},
			searchAllServiceMock = {},
			searchDrugServiceMock,
			searchProducerServiceMock,
			searchSubstanceServiceMock,
			searchController = {};

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
	});
});
