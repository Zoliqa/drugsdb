
define(["jquery", "public/lib/jquery-ui/ui/slider"], 
	function ($, jqSlider) {
	
		function faSlider() {
			return {
				restrict: "A",
				scope: {
					model: "=faSliderModel",
				},
				link: link
			};

			function link(scope, element, attrs) { 
				element.slider({
					min: 0, 
					max: 50,
					slide: function (event, ui) {
						scope.model = ui.value;

						scope.$apply();
					}
				});
			}
		}
	
		return faSlider;
	}
);