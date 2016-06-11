define(["angularMocks", "public/app/users/users.module"], function (angularMocks, usersModule) {

	describe("users module routes", function () {
		var $q,
			$route,
			$rootScope,
			$httpBackend,
			userServiceInstance;

		beforeEach(function () {
			module("users");

			angular.module("users")
				.factory("cacheService", function () { return {}; })
				.factory("dbService", function () { return {}; });
		});

		beforeEach(inject(function (_$q_, _$route_, _$rootScope_, _$httpBackend_) {
			$q = _$q_;
			$route = _$route_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;

			var userServiceMock = function () {
				return userServiceInstance = {
					current: {
						get: function () {
							return {
								$promise: $q.when({
									_id: null
								})
							};
						}
					}
				};
			};

			angular.module("users").factory("userService", userServiceMock);
		}));

		it("should define /user/login route", function () {
			expect($route.routes["/user/login"]).toBeDefined();

			expect($route.routes["/user/login"].controller).toBe("LoginController");
			expect($route.routes["/user/login"].templateUrl).toBe("/public/app/users/login.html");
		});

		it("should define /user/register route", function () {
			expect($route.routes["/user/register"]).toBeDefined();

			expect($route.routes["/user/register"].controller).toBe("RegisterController");
			expect($route.routes["/user/register"].templateUrl).toBe("/public/app/users/register.html");
		});

		it("should define /user/profile route", function () {
			expect($route.routes["/user/profile"]).toBeDefined();

			expect($route.routes["/user/profile"].controller).toBe("ProfileController");
			expect($route.routes["/user/profile"].templateUrl).toBe("/public/app/users/profile.html");
		});

		it("should allow access /user/profile route for authenticated users", function (done) {
			var userServiceInstance = {
				current: {
					get: function () {}
				}
			};

			spyOn(userServiceInstance.current, "get").and.returnValue({
				$promise: $q.when({
					_id: 123
				})
			});

			var resolve = $route.routes["/user/profile"];

			expect(resolve).toBeDefined();

			var auth = $route.routes["/user/profile"].resolve.auth;

			expect(auth).toBeDefined();

			$httpBackend.expectGET("/public/app/users/login.html").respond(200);

			var promise = auth($q, "UNAUTHORIZED", userServiceInstance),
				resolvedValue = null;

			promise.then(function (value) {
				resolvedValue = value;
			}).finally(function () {
				expect(resolvedValue).toBe(true);

				done();
			});

			$rootScope.$apply();
		});

		it("should not allow access /user/profile route for unauthenticated users", function () {
			var userServiceInstance = {
				current: {
					get: function () {}
				}
			};

			spyOn(userServiceInstance.current, "get").and.returnValue({
				$promise: $q.when({
					_id: null
				})
			});

			var resolve = $route.routes["/user/profile"];

			expect(resolve).toBeDefined();

			var auth = $route.routes["/user/profile"].resolve.auth;

			expect(auth).toBeDefined();

			$httpBackend.expectGET("/public/app/users/login.html").respond(200);

			var promise = auth($q, "UNAUTHORIZED", userServiceInstance),
				resolvedValue = null;

			promise.catch(function (value) {
				resolvedValue = value;
			}).finally(function () {
				expect(resolvedValue).toBe("UNAUTHORIZED");

				done();
			});

			$rootScope.$apply();
		});
	});
});
