define(["angularMocks", "app/main/main.run"], function (angularMocks, mainRun) {

	describe("mainRun", function () {
		var $q,
			$rootScope,
			locationMock,
			USER_LOGGED_IN = 1,
			UNAUTHORIZED = 2,
			OfflineMock,
			userOnlineServiceMock,
			userOfflineServiceMock;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			locationMock = {
				path: function () {}
			};

			OfflineMock = {
				on: function () {}
			};

			userOnlineServiceMock = {
				logout: function () {}
			};

			userOfflineServiceMock = {
				logout: function () {}
			};
		}));

		function create_mainRun() {
			mainRun($rootScope, locationMock, USER_LOGGED_IN, UNAUTHORIZED, OfflineMock, userOnlineServiceMock, userOfflineServiceMock);
		}

		it("should be defined", function () {
			expect(mainRun).not.toBeNull();
		});

		it("should redirect to /search route on USER_LOGGED_IN event", function () {
			spyOn(locationMock, "path");

			create_mainRun();

			$rootScope.$broadcast(USER_LOGGED_IN);

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/search");
		});

		it("should redirect to /user/login route on UNAUTHORIZED event", function () {
			spyOn(locationMock, "path");

			create_mainRun();

			$rootScope.$emit("$routeChangeError", null, null, UNAUTHORIZED);

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/user/login");
		});

		it("should redirect to /user/login when going offline", function () {
			spyOn(OfflineMock, "on").and.callFake(function (type, callback) {
				if (type === "down")
					callback();
			});

			spyOn(userOfflineServiceMock, "logout").and.returnValue({
				$promise: $q.when({})
			});

			spyOn(locationMock, "path");

			create_mainRun();

			$rootScope.$apply();

			expect(OfflineMock.on).toHaveBeenCalled();

			expect(userOfflineServiceMock.logout).toHaveBeenCalled();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/user/login");
		});

		it("should redirect to /user/login when going online", function () {
			spyOn(OfflineMock, "on").and.callFake(function (type, callback) {
				if (type === "up")
					callback();
			});

			spyOn(userOnlineServiceMock, "logout").and.returnValue({
				$promise: $q.when({})
			});

			spyOn(locationMock, "path");

			create_mainRun();

			$rootScope.$apply();

			expect(OfflineMock.on).toHaveBeenCalled();

			expect(userOnlineServiceMock.logout).toHaveBeenCalled();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/user/login");
		});
	});
});
