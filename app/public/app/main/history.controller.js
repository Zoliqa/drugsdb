define([], function () {

		function HistoryController($injector, $location, _, searchEntryService) {
			var vm = this;

			this.searchEntries = [];
			this.selectEntry = selectEntry;
			this.removeEntry = removeEntry;

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

			function removeEntry(searchEntry) {
				searchEntryService.remove({ id: searchEntry._id }).$promise.then(function () {
					var index = _.findIndex(vm.searchEntries, function (searchEntry2) {
						return searchEntry2._id === searchEntry._id;
					});

					vm.searchEntries.splice(index, 1);
				});
			}
		}

		return HistoryController;
	}
);
