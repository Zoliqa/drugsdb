define([], function () {

		function SearchController(searchAllService, searchDrugService, searchProducerService, searchSubstanceService) {
			var vm = this,
				searchService;

			this.searchTerm = "";
			// this.searchByOptions = {
			// 	all: "all",
			// 	drug: "drug",
			// 	producer: "producer",
			// 	ingredient: "ingredient"
			// };
			this.searchBy = "";
			this.search = search;
			this.checkKey = checkKey;
			this.results = [];
			this.showListVertically = false;
			this.toggleDisplayOfList = toggleDisplayOfList;
			this.reset = reset;
			this.searchByAll = searchByAll;
			this.searchByDrug = searchByDrug;
			this.searchByProducer = searchByProducer;
			this.searchByIngredient = searchByIngredient;

			(function () {
				searchByDrug();
			}());

			function searchByAll() {
				vm.searchBy = "all";

				vm.searchService = searchAllService;
			}

			function searchByDrug() {
				vm.searchBy = "drug";

				vm.searchService = searchDrugService;
			}

			function searchByProducer() {
				vm.searchBy = "producer";

				vm.searchService = searchProducerService;
			}

			function searchByIngredient() {
				vm.searchBy = "ingredient";

				vm.searchService = searchSubstanceService;
			}

			function search() {
				vm.results.splice(0);

				if (vm.searchTerm.trim() !== "")
					vm.searchService.search(vm.searchTerm).then(function (results) {
						vm.results = results;
					});
			}

			function checkKey($event) {
				if ($event.keyCode === 13)
					search();
			}

			function toggleDisplayOfList() {
				vm.showListVertically = !vm.showListVertically;
			}

			function reset() {
				vm.searchTerm = "";
				vm.results.splice(0);
			}
		}

		return SearchController;
	}
);
