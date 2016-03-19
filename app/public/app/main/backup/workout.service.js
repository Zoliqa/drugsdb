
define([], function () {
	
	function workoutService(Offline, workoutOnlineService, workoutOfflineService) {
		var service = {
			current: Offline.state === "down" ? workoutOfflineService : workoutOnlineService,
		};

		Offline.on("confirmed-down", function () {
			service.current = workoutOfflineService;
		});
		
		Offline.on("confirmed-up", function () {
			service.current = workoutOnlineService;
		});
		
		return service;
	}
	
	return workoutService;
});