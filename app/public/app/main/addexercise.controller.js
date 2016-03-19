
define([], function () { 

		function AddExerciseController($uibModalInstance, _, muscleGroupsService, exerciseService, workout) {
			var vm = this;
		
			this.workout = workout;
			this.getMuscleGroupById = muscleGroupsService.getById;
			this.exercise = {
				groupId: workout.selectedGroups[0],
				name: "",
				started: new Date(),
				notes: ""
			};
			this.resetDate = resetDate;
			this.addExercise = addExercise;
			this.cancel = cancel;
		
			function resetDate() {
				vm.exercise.started = new Date();
			}

			function addExercise() {
				exerciseService.current.save(vm.exercise).$promise.then(function (exercise) { 
					if (exercise._id) {
						$uibModalInstance.close();
					
						if (!workout.exercises)
							workout.exercises = [];

						workout.exercises.push(exercise);
					}
				}).catch(function () { 
					vm.errorMessage = "Error occurred saving the exercise.";
				});
			}

			function cancel() {
				$uibModalInstance.dismiss();
			}
		}

		return AddExerciseController;
	}
);



