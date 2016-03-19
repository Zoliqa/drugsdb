
define([], function () {
	
	function exerciseOnlineService($resource) {
		var resource = $resource("/exercise/:id", null, {
			update: { method: "PUT" }
		});
		
		return resource;
	}
	
	return exerciseOnlineService;
});