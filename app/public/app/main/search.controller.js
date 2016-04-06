define([], function () {

		function SearchController($scope, $location, $injector, searchEntryService, searchAllService, searchDrugService, searchProducerService, searchSubstanceService) {
			var vm = this,
				searchService;

			this.searchTerm = "";
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
			this.searchBySubstance = searchBySubstance;
			this.handleSubstanceClick = handleSubstanceClick;
			this.getResultsTemplateName = getResultsTemplateName;

			(function () {
				searchByDrug();

				var actualLocation = "";

				function checkSearchParams() {
					try {
						var name = $location.search().type;

						vm.searchService = $injector.get(name);
						vm.searchTerm = $location.search().term;

						search();
					}
					catch(e) {}
				}

				$scope.$on('$locationChangeSuccess', function(){
				  	actualLocation = JSON.stringify($location.search());
				});

				$scope.$watch(function () {
					return JSON.stringify($location.search());
				}, function (newLocation) {
					if (actualLocation === newLocation)
						checkSearchParams();
				});

				checkSearchParams();
			}());

			function searchByAll() {
				vm.searchService = searchAllService;
			}

			function searchByDrug() {
				vm.results = null;
				vm.searchService = searchDrugService;
			}

			function handleDrugClick(drugName) {
				searchByDrug();

				vm.searchTerm = drugName;

				search();
			}

			function searchByProducer() {
				vm.results = null;
				vm.searchService = searchProducerService;
			}

			function handleProducerClick(producerName) {
				searchByProducer();

				vm.searchTerm = producerName;

				search();
			}

			function searchBySubstance() {
				vm.results = null;
				vm.searchService = searchSubstanceService;
			}

			function handleSubstanceClick(substanceName) {
				searchBySubstance();

				vm.searchTerm = substanceName;

				search();
			}

			function search() {
				if (vm.searchTerm.trim() !== "") {
					vm.searchService.search(vm.searchTerm).then(function (results) {
						vm.results = results;

						var searchEntry = {
							type: vm.searchService.name,
							term: vm.searchTerm,
							date: new Date()
						};

						searchEntryService.save(searchEntry).$promise.catch(function () {
							console.log("error saving searchEntry");
						});
					});

					$location.search({
						type: vm.searchService.name,
						term: vm.searchTerm
					});
				}
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
				vm.results = null;
			}

			function getResultsTemplateName() {
				return "/public/app/main/results/" + vm.searchService.template + ".html";
			}
		}

		return SearchController;
	}
);
