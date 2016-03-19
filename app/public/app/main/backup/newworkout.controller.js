
define([], function () { 

		function NewWorkoutController($location, _, workoutService, muscleGroupsService, cacheService) {
			var vm = this;
		
			this.errorMessage = "";
			this.workout = {
				started: new Date(),
				selectedGroups: [],
				notes: "",
				location: ""
			};
			this.dateOptions = { formatYear: 'yy', startingDay: 1 };
			this.datePickerIsOpened = false;
			this.groups = muscleGroupsService.getAll();
			this.resetDate = resetDate;
			this.addWorkout = addWorkout;
			this.cancel = cancel;

			function resetDate () {
				vm.workout.started = new Date();
			}
		
			function addWorkout() {
				_.each(vm.groups, function (group) {
					if (group.selected)
						vm.workout.selectedGroups.push(group.id);
				})

				workoutService.current.save(vm.workout).$promise.then(function (workout) { 
					if (workout._id) {
						$location.path("/home");
					
						// remove the user from cache since next time we want to retrieve the user with his/her newly added active workout
						cacheService.invalidate("/user");
					}
				}, function () { 
					vm.errorMessage = "Error occurred saving the workout.";	
				});
			};
		
			function cancel() {
				$location.path("/home");
			}
		}

		return NewWorkoutController;
	}
);



