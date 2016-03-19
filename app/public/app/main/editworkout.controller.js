
define([], function () { 

		function EditWorkoutController(
			$location, $uibModal, _, muscleGroupsService, workoutService, exerciseService, cacheService) {
		
			var vm = this;
		
			this.workout = null;
			this.getMuscleGroupById = muscleGroupsService.getById;
			this.endWorkout = endWorkout;
			this.removeWorkout = removeWorkout;
			this.formatGroups = formatGroups;
			this.addExercise = addExercise;
			this.newSet = {};
			this.addNewSet = addNewSet;
			this.selectExercise = selectExercise;
			this.removeExercise = removeExercise;
			this.removeSet = removeSet;
		
			//userService.current.get().$promise.then(function (user) {
			//	vm.workout = user.workouts[0];
			//});
		
			workoutService.current.getActiveWorkout().then(function (workout) {
				vm.workout = workout;
			});

			function endWorkout() {
				vm.workout.ended = new Date();

				workoutService.current.update({ id: vm.workout._id }, vm.workout).$promise.then(function () { 
					$location.path("/home");
					
					cacheService.invalidate("/user");	
				});	
			}

			function removeWorkout() {
				workoutService.current.delete({ id: vm.workout._id }).$promise.then(function () { 
					$location.path("/home");

					cacheService.invalidate("/user");
				});
			}
		
			function formatGroups() {
				if (vm.workout)
					return _.reduce(vm.workout.selectedGroups, function (memo, groupId) { 
						return memo + ", " + muscleGroupsService.getById(groupId).name;
					}, "").slice(1);
			}

			function addExercise() {
				var modal = $uibModal.open({
					templateUrl: "/public/app/main/add-exercise.html",
					size: "md",
					controller: "AddExerciseController",
					controllerAs: "vm",
					resolve: {
						workout: function () {
							return vm.workout;
						}	
					}
				});
			}

			function addNewSet(exercise) {
				if (vm.newSet.reps > 0 && vm.newSet.weight > 0) {
					if (!exercise.sets)
						exercise.sets = [];

					exercise.sets.push({ reps: vm.newSet.reps, weight: vm.newSet.weight });

					exerciseService.current.update({ id: exercise._id }, exercise).$promise.then(function () { 
						vm.newSet.reps = "";
						vm.newSet.weight = "";	
					});
				}
			}

			function selectExercise() {
				vm.newSet.reps = 0;
				vm.newSet.weight = null;
			}

			function removeExercise(exercise) {
				exerciseService.current.delete({ id: exercise._id }).$promise.then(function () { 
					vm.workout.exercises = _.filter(vm.workout.exercises, function (exercise2) { 
						return exercise2._id !== exercise._id;
					});
				});
			}

			function removeSet(exercise, set) {
				var index = _.indexOf(exercise.sets, function (set2) { 
					return set2 == set;
				});			
			
				exercise.sets.splice(index, 1);

				exerciseService.current.update({ id: exercise._id }, exercise);
			}
		}

		return EditWorkoutController;
	}
);



