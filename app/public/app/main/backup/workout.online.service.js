
define([], function () {
	
	function workoutOnlineService($resource, $q, _, userOnlineService, dbService, utilityService) {
		var service = $resource("/workout/:id", null, {
			save: {
				method: "POST",
				transformRequest: function (data, headers) {
					validateWorkout(data);
					
					return JSON.stringify(data);
				},
				interceptor: {
					// response: addWorkout,
					request: validateWorkout
				}
			},
			update: {
				method: "PUT",
				transformRequest: function (data, headers) {
					validateWorkout(data);
					
					return JSON.stringify(data);
				},
				interceptor: {
					// response: deleteWorkout
				}
			},
			"delete": {
				method: "DELETE"
				//interceptor: {
				//	response: deleteWorkout
				//}
			}
		});
		
		service.getActiveWorkout = getActiveWorkout;

		return service;
		
		function validateWorkout(workout) {
			_.each(workout.exercises, function (exercise) { 
				if (utilityService.isGuid(exercise._id))
					delete exercise._id;
			});
		}	

		function getActiveWorkout() {
			var deferred = $q.defer();
			
			userOnlineService.get().$promise.then(function (user) {
				deferred.resolve(user.workouts && user.workouts[0]);
			}, function (err) {
				deferred.reject(err);
			});
			
			return deferred.promise;
		}	

		function addWorkout(result) { 
			if (result && result.data && result.data._id) {
				userOnlineService.get().$promise.then(function (user) {
					return dbService.getUser(user._id);
				}).then(function (user) {
					user.workouts = [result.data];
					
					dbService.saveUser(user);
				});
			}
			
			return result && result.data || {};
		}

		function deleteWorkout(result) {
			userOnlineService.get().$promise.then(function (user) {
				return dbService.getUser(user._id);
			}).then(function (user) {
				user.workouts = [];
					
				dbService.saveUser(user);
			});
			
			return result && result.data || {};
		}
	}
	
	return workoutOnlineService;
});