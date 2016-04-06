define([], function () {

		function HistoryController($injector, $location, _, searchEntryService) {
			var vm = this;

			this.searchEntries = [];
			this.selectEntry = selectEntry;

			(function init() {
				searchEntryService.query().$promise.then(function (searchEntries) {
					_.each(searchEntries, function (searchEntry) {
						try {
							var service = $injector.get(searchEntry.type);

							searchEntry.service = service;
						}
						catch (e) {
						}
					});

					vm.searchEntries = searchEntries;
				});
			}());

			function selectEntry(searchEntry) {
				$location.path("/search").search({
					type: searchEntry.service.name,
					term: searchEntry.term
				});
			}
		}

		return HistoryController;
	}
);
