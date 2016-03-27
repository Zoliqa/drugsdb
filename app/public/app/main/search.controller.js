define([], function () {

		function SearchController(searchService) {
			var vm = this;

			this.searchTerm = "";
			this.searchByOptions = {
				all: "all",
				drug: "drug",
				producer: "producer",
				ingredient: "ingredient"
			};
			this.searchBy = this.searchByOptions.drug;
			this.search = search;
			this.checkKey = checkKey;
			this.drugs = [];
			this.showIngredientsVertically = false;
			this.toggleDisplayOfIngredients = toggleDisplayOfIngredients;

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

			function toggleDisplayOfIngredients() {
				vm.showIngredientsVertically = !vm.showIngredientsVertically;
			}
		}

		return SearchController;
	}
);
