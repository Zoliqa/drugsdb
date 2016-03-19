
define("app/main/main.run", [], function () { 
	return function () { };
});

define("app/main/main.config", [], function () {
	return function () { };
});

define(["angular", "angularMocks", "public/app/main/main.module"], 
	function (angular, angularMocks, mainModule) {
	
	describe("NewSessionController", function () {
		var $controller, 
			$httpBackend, 
			newWorkoutController, 
			$locationMock, 
			workoutServiceMock,
			muscleGroupsServiceMock,
			cacheServiceMock,
			muscleGroups;
		
		beforeEach(module("main"));
		
		beforeEach(inject(function ($injector) {
			$controller = $injector.get("$controller");
			
			$httpBackend = $injector.get("$httpBackend");
			
			userDataServiceMock = {
				loggedInUser: function (user) { 
				}
			};
			
			locationMock = jasmine.createSpyObj("$location", ["path"]);

			workoutServiceMock = {
				save: function (workout, success) { 
				}
			};
			
			muscleGroups = [
				{ id: 1 },
				{ id: 2 }, 
				{ id: 3 }
			];

			muscleGroupsServiceMock = {
				getAll: function () {
					return muscleGroups;
				}
			};
			
			cacheServiceMock = jasmine.createSpyObj("cacheService", ["invalidate"]);

			newWorkoutController = $controller("NewWorkoutController", {
				$location: locationMock,
				workoutService: workoutServiceMock,
				muscleGroupsService: muscleGroupsServiceMock, 
				cacheService: cacheServiceMock
			});
		}));

		it("should create the NewWorkoutController", function () { 
			expect(newWorkoutController).toBeDefined();
		});

		it("should add new workout and redirect to home page", function () {
			newWorkoutController.groups = [
				angular.extend(muscleGroups[0], { selected: true }),
				angular.extend(muscleGroups[1], { selected: true }),
				angular.extend(muscleGroups[2], { selected: false })
			];
			
			var savedWorkout = { _id: 123 };

			spyOn(workoutServiceMock, "save").and.callFake(function (workout, success, error) { 
				success(savedWorkout);
			});
			
			newWorkoutController.addWorkout();
			
			expect(workoutServiceMock.save).toHaveBeenCalled();
			expect(workoutServiceMock.save.calls.argsFor(0)[0]).toBe(newWorkoutController.workout);

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toEqual("/home");

			expect(cacheServiceMock.invalidate).toHaveBeenCalled();
			expect(cacheServiceMock.invalidate.calls.argsFor(0)[0]).toEqual("/user");
		});
		
		it("should initialize the workout with the selected groups", function () {
			newWorkoutController.groups = [
				angular.extend(muscleGroups[0], { selected: true }),
				angular.extend(muscleGroups[1], { selected: true }),
				angular.extend(muscleGroups[2], { selected: false })
			];
			
			var savedWorkout = { _id: 123 };
			
			spyOn(workoutServiceMock, "save").and.callFake(function (workout, success, error) {
				success(savedWorkout);
			});
			
			newWorkoutController.addWorkout();
			
			expect(workoutServiceMock.save).toHaveBeenCalled();
			expect(workoutServiceMock.save.calls.argsFor(0)[0]).toBe(newWorkoutController.workout);

			expect(newWorkoutController.workout.selectedGroups).toContain(newWorkoutController.groups[0].id);
			expect(newWorkoutController.workout.selectedGroups).toContain(newWorkoutController.groups[1].id);
			expect(newWorkoutController.workout.selectedGroups).not.toContain(newWorkoutController.groups[2].id);
		});

		it("should show error message on failure of saving workout", function () { 
			newWorkoutController.groups = [
				angular.extend(muscleGroups[0], { selected: true }),
				angular.extend(muscleGroups[1], { selected: true })
			];
			
			var savedWorkout = { _id: 123 };
			
			spyOn(workoutServiceMock, "save").and.callFake(function (workout, success, error) {
				error();
			});
			
			newWorkoutController.addWorkout();
			
			expect(workoutServiceMock.save).toHaveBeenCalled();
			expect(workoutServiceMock.save.calls.argsFor(0)[0]).toBe(newWorkoutController.workout);

			expect(locationMock.path).not.toHaveBeenCalled();
			expect(cacheServiceMock.invalidate).not.toHaveBeenCalled();

			expect(newWorkoutController.errorMessage).toBeTruthy();
		});
	});
});