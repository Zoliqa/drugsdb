define(["angularMocks", "underscore", "app/main/history.controller"], function (angularMocks, _, HistoryController) {

	describe("HistoryController", function () {
		var $q,
			$rootScope,
			injectorMock,
			locationMock,
			searchEntryServiceMock,
			historyController;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			injectorMock = {
				get: function () {}
			};

			locationMock = {
				path: function () {},
				search: function () {}
			};

			searchEntryServiceMock = {
				query: function () {},
				search: function () {},
				remove: function () {}
			};
		}));

		function createHistoryController() {
			historyController = new HistoryController(injectorMock, locationMock, _, searchEntryServiceMock);
		}

		it("should be defined", function () {
			expect(HistoryController).not.toBeNull();
		});

		it("should populate search entries", function () {
			var searchEntries = [1, 2, 3];

			spyOn(searchEntryServiceMock, "query").and.returnValue({
				$promise: $q.when(searchEntries)
			});

			createHistoryController();

			$rootScope.$apply();

			expect(historyController.searchEntries).toBe(searchEntries);
		});

		it("should set correct service for each search entry returned", function () {
			var searchEntries = [{}, {}];

			spyOn(searchEntryServiceMock, "query").and.returnValue({
				$promise: $q.when(searchEntries)
			});

			var serviceMock = {};

			spyOn(injectorMock, "get").and.returnValue(serviceMock);

			createHistoryController();

			$rootScope.$apply();

			expect(searchEntries[0].service).toBe(serviceMock);
			expect(searchEntries[1].service).toBe(serviceMock);
		});

		it("select entry should redirect to /search route", function () {
			spyOn(locationMock, "path").and.returnValue(locationMock);
			spyOn(locationMock, "search");

			spyOn(searchEntryServiceMock, "query").and.returnValue({
				$promise: $q.when([])
			});

			createHistoryController();

			var searchEntry = {
				service: {
					name: "FakeService"
				},
				term: "Term"
			};

			historyController.selectEntry(searchEntry);

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/search");

			expect(locationMock.search).toHaveBeenCalled();
			expect(locationMock.search.calls.argsFor(0)[0]).toEqual({
				type: "FakeService",
				term: "Term"
			});
		});

		it("should remove selected search entry", function () {
			var searchEntries = [{
				_id: 1
			}, {
				_id: 2
			}];

			spyOn(searchEntryServiceMock, "query").and.returnValue({
				$promise: $q.when(searchEntries)
			});

			spyOn(searchEntryServiceMock, "remove").and.returnValue({
				$promise: $q.when({})
			});

			createHistoryController();

			historyController.removeEntry(searchEntries[1]);

			$rootScope.$apply();

			expect(searchEntryServiceMock.remove).toHaveBeenCalled();
			expect(searchEntryServiceMock.remove.calls.argsFor(0)[0]).toEqual({
				id: 2
			});

			expect(historyController.searchEntries.length).toBe(1);
			expect(historyController.searchEntries).toContain(searchEntries[0]);
		});
	});
});
