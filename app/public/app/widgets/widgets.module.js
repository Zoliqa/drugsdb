
define([
	"angular", 
	"app/widgets/fa-slider.directive"], 
	function (angular, 
			  faSlider) {
	
		angular.module("widgets", [])
			.directive("faSlider", faSlider);
	}
);

