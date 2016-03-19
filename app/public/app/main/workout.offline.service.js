
define([], function () {
	
	function workoutOfflineService($q, _, dbService, utilityService, userOfflineService) {
		var service = {
			save: save,
			update: update,
			"delete": deleteWorkout
		};
		
		service.getActiveWorkout = getActiveWorkout;

		return service;
		
		function getActiveWorkout() {
			var deferred = $q.defer();
			
			userOfflineService.get().$promise.then(function (user) {
				var activeWorkout = _.find(user.workouts, function (workout) { 
					return !workout.isDeleted && !workout.ended;
				});
				
				deferred.resolve(activeWorkout);
			}).catch(function (err) {
				deferred.reject(err);
			});
			
			return deferred.promise;
		}	

		function save(workout) {
			var deferred = $q.defer();

			userOfflineService.get().$promise.then(function (user) {
				workout._id = utilityService.generateGuid();
				workout.lastModified = new Date();

				user.workouts.push(workout);
				
				return dbService.saveUser(user);
			}).then(function () { 
				deferred.resolve(workout);
			}, function (err) { 
				deferred.reject(err);
			});

			return { $promise: deferred.promise };
		}
		
		function findWorkoutIndex(user, id) { 
			var index = _.findIndex(user.workouts, function (workout) {
				return workout._id === id;
			});

			return index;
		}

		function update(params, workout) { 
			var deferred = $q.defer();
			
			userOfflineService.get().$promise.then(function (user) {
				workout.lastModified = new Date();
				
				var index = findWorkoutIndex(user, params.id);
				user.workouts[index] = workout;

				return dbService.saveUser(user);
			}).then(function () {
				deferred.resolve(workout);
			}, function (err) {
				deferred.reject(err);
			});
			
			return { $promise: deferred.promise };
		}

		function deleteWorkout(params) {
			var deferred = $q.defer();

			userOfflineService.get().$promise.then(function (user) {
				var index = findWorkoutIndex(user, params.id);
				var workout = user.workouts[index];

				workout.isDeleted = true;
				workout.modifiedDate = new Date();

				return dbService.saveUser(user);
			}).then(function () { 
				deferred.resolve({});
			}, function (err) { 
				deferred.reject(err);
			});

			return { $promise: deferred.promise };
		}
	}
	
	return workoutOfflineService;
});