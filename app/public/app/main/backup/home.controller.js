
define([], 
	function () { 

		function HomeController($scope, userService, workoutService) {
			var vm = this;
		
			this.activeWorkout = null;

			//userService.current.get().$promise.then(function (user) { 
			//	vm.message = "Welcome home " + user.username;
			//	vm.activeWorkout = user.workouts && user.workouts[0] && user.workouts[0].isDeleted;
			//});

			workoutService.current.getActiveWorkout().then(function (workout) { 
				vm.activeWorkout = workout;
			});
		}

		return HomeController; 
	}
);