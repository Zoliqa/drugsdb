
define([], function () {
	
	function exerciseOfflineService($q, _, dbService, utilityService, userOfflineService, workoutOfflineService) {
		var service = {
			save: save,
			update: update,
			"delete": deleteExercise
		};
		
		return service;
		
		function updateUser(user, activeWorkout) { 
			var index = _.findIndex(user.workouts, function (workout) {
				return workout._id === activeWorkout._id;
			});
			
			user.workouts[index] = activeWorkout;
			
			return dbService.saveUser(user);
		}	

		function save(exercise) {
			var deferred = $q.defer();
			var activeWorkout;
			
			workoutOfflineService.getActiveWorkout().then(function (workout) {
				activeWorkout = workout;

				activeWorkout.lastModified = new Date();
				exercise._id = utilityService.generateGuid();
				
				if (!activeWorkout.exercises)
					activeWorkout.exercises = [];				
				
				activeWorkout.exercises.push(exercise);
				
				return userOfflineService.get().$promise;
			}).then(function (user) {
				return updateUser(user, activeWorkout);
			}).then(function () {
				deferred.resolve(exercise);
			}).catch(function (err) {
				deferred.reject(err);
			});
			
			return {
				$promise: deferred.promise
			};
		}
		
		function findExerciseIndex(activeWorkout, id) { 
			var index = _.findIndex(activeWorkout.exercises, function (exercise) {
				return exercise._id === id;
			});

			return index;
		}

		function update(params, exercise) {
			var deferred = $q.defer();
			var activeWorkout;
			
			workoutOfflineService.getActiveWorkout().then(function (workout) {
				activeWorkout = workout;

				var index = findExerciseIndex(activeWorkout, params.id);
				
				activeWorkout.lastModified = new Date();
				activeWorkout.exercises[index] = exercise;

				return userOfflineService.get().$promise;
			}).then(function (user) {
				return updateUser(user, activeWorkout);
			}).then(function () {
				deferred.resolve(exercise);
			}).catch(function (err) {
				deferred.reject(err);
			});
			
			return { $promise: deferred.promise };  
		}
		
		function deleteExercise(params) {
			var deferred = $q.defer();
			
			workoutOfflineService.getActiveWorkout().then(function (workout) {
				activeWorkout = workout;

				var index = findExerciseIndex(activeWorkout, params.id);
				
				activeWorkout.lastModified = new Date();
				activeWorkout.exercises.splice(index, 1);
				
				return userOfflineService.get().$promise;
			}).then(function (user) {
				return updateUser(user, activeWorkout);
			}).then(function () {
				deferred.resolve({});
			}).catch(function (err) {
				deferred.reject(err);
			});
			
			return {
				$promise: deferred.promise
			};
		}
	}
	
	return exerciseOfflineService;
});