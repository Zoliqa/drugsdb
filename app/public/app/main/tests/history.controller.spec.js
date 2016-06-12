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
				path: function () {}
			};

			searchEntryMock = {
				search: function () {}
			};
		}));

		function createHistoryController() {
			historyController = new HistoryController(injectorMock, locationMock, _, searchEntryMock);
		}

		it("should be defined", function () {
			expect(HistoryController).not.toBeNull();
		});
	});
});
