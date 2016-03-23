define([], function () {

		function SearchController(searchService) {
			var vm = this;

			this.searchTerm = "";
			this.search = search;
			this.checkKey = checkKey;
			this.drugs = [];

			function search() {
				vm.drugs.splice(0);

				if (vm.searchTerm.trim() !== "")
					searchService.search(vm.searchTerm).then(function (result) {
						vm.drugs = result;
					});
			}

			function checkKey($event) {
				if ($event.keyCode === 13)
					search();
			}
		}

		return SearchController;
	}
);
