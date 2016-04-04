define([], function () {

		function SearchController($injector, searchAllService, searchDrugService, searchProducerService, searchSubstanceService) {
			var vm = this,
				searchService;

			this.searchTerm = "";
			this.searchBy = "";
			this.search = search;
			this.checkKey = checkKey;
			this.results = null;
			this.showListVertically = false;
			this.toggleDisplayOfList = toggleDisplayOfList;
			this.reset = reset;
			this.searchByAll = searchByAll;
			this.searchByDrug = searchByDrug;
			this.handleDrugClick = handleDrugClick;
			this.searchByProducer = searchByProducer;
			this.handleProducerClick = handleProducerClick;
			this.searchByIngredient = searchByIngredient;
			this.handleIngredientClick = handleIngredientClick;
			this.getResultsTemplateName = getResultsTemplateName;

			(function () {
				searchByDrug();

				var service = $injector.get("searchDrugService");
			}());

			function searchByAll() {
				vm.searchBy = "all";

				vm.searchService = searchAllService;
			}

			function searchByDrug() {
				vm.results = null;
				vm.searchTerm = "";
				vm.searchBy = "drug";
				vm.searchService = searchDrugService;
			}

			function handleDrugClick(drugName) {
				searchByDrug();

				vm.searchTerm = drugName;

				search();
			}

			function searchByProducer() {
				vm.results = null;
				vm.searchTerm = "";
				vm.searchBy = "producer";
				vm.searchService = searchProducerService;
			}

			function handleProducerClick(producerName) {
				searchByProducer();

				vm.searchTerm = producerName;

				search();
			}

			function searchByIngredient(ingredientName) {
				vm.results = null;
				vm.searchTerm = "";
				vm.searchBy = "ingredient";
				vm.searchService = searchSubstanceService;
			}

			function handleIngredientClick(ingredientName) {
				searchByIngredient();

				vm.searchTerm = ingredientName;

				search();
			}

			function search() {
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

			function getResultsTemplateName() {
				return "/public/app/main/results/" + vm.searchBy + ".html";
			}
		}

		return SearchController;
	}
);
