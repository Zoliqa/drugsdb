define([], function () {

	function SearchController(
		$scope, $location, $injector, $uibModal, searchEntryService, searchAllService, searchDrugService, searchProducerService, searchSubstanceService) {

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
		this.showDrugDetails = showDrugDetails;

		(function () {
			var actualSearchParams = "";

			function checkSearchParams() {
				try {
					var name = $location.search().type;

					vm.searchTerm = $location.search().term;
					vm.searchService = $injector.get(name);

					search();
				}
				catch(e) {
					$location.search("type", "");

					searchByDrug();
				}
			}

			// when history buttons are used (back or forward), this function will be called first, then the next function inside the watch which will
			// detect that the search params are the same; otherwise, if we set a new value for the search params the next function inside the watch will be called
			// first, followed by this function
			$scope.$on('$locationChangeSuccess', function(){
			  	actualSearchParams = JSON.stringify($location.search());
			});

			$scope.$watch(function () {
				return JSON.stringify($location.search());
			}, function (newSearchParams) {
				if (actualSearchParams === newSearchParams)
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

		function showDrugDetails(drug) {
			$uibModal.open({
				templateUrl: "/public/app/main/drug.details.html",
				windowClass: "fullscreen",
				controller: "DrugDetailsController",
				controllerAs: "vm",
				resolve: {
					drug: function () {
						return drug;
					}
				}
			});
		}
	}

	return SearchController;
});
