define(["angularMocks", "app/main/main.module"], function (angularMocks, mainModule) {

	describe("main module routes", function () {
		var $q,
			$route,
			$rootScope,
			$httpBackend,
			userServiceInstance;

		beforeEach(function () {
			module("main");

			angular.module("main")
				.factory("cacheService", function () { return {}; })
				.factory("dbService", function () { return {}; })
				.factory("userOnlineService", function () { return {}; })
				.factory("userOfflineService", function () { return {}; });
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

			angular.module("main").factory("userService", userServiceMock);
		}));

		it("should define /search route", function () {
			expect($route.routes["/search"]).toBeDefined();

			expect($route.routes["/search"].controller).toBe("SearchController");
			expect($route.routes["/search"].templateUrl).toBe("/public/app/main/search.html");
		});

		it("should define /history route", function () {
			expect($route.routes["/history"]).toBeDefined();

			expect($route.routes["/history"].controller).toBe("HistoryController");
			expect($route.routes["/history"].templateUrl).toBe("/public/app/main/history.html");
		});

		it("should allow access to /search route for authenticated users", function () {
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

			var resolve = $route.routes["/search"].resolve;

			expect(resolve).toBeDefined();

			var auth = resolve.auth;

			expect(auth).toBeDefined();

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

		it("should allow access to /history route for authenticated users", function () {
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

			var resolve = $route.routes["/history"].resolve;

			expect(resolve).toBeDefined();

			var auth = resolve.auth;

			expect(auth).toBeDefined();

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
