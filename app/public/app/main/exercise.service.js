
define([], function () {
	
	function exerciseService(Offline, exerciseOnlineService, exerciseOfflineService) {
		var service = {
			current: Offline.state === "down" ? exerciseOfflineService : exerciseOnlineService
		};
		
		Offline.on("confirmed-down", function () {
			service.current = exerciseOfflineService;
		});
		
		Offline.on("confirmed-up", function () {
			service.current = exerciseOnlineService;
		});
		
		return service;
	}
	
	return exerciseService;
});