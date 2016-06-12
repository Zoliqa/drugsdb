define(["angularMocks", "app/main/pageheader.controller"], function (angularMocks, PageHeaderController) {

	describe("PageHeaderController", function () {
		var $q,
			$rootScope,
			locationMock,
			USER_LOGGED_IN = 1,
			userServiceMock,
			pageHeaderController;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			locationMock = {
				path: function () {}
			};

			userServiceMock = {
				current: {
					get: function () {},
					logout: function () {}
				}
			};
		}));

		function createPageHeaderController() {
			pageHeaderController = new PageHeaderController($rootScope, locationMock, USER_LOGGED_IN, userServiceMock);
		}

		it("should be defined", function () {
			expect(PageHeaderController).toBeDefined();
		});

		it("should set logged in user", function () {
			var user = {
				_id: 123
			};

			spyOn(userServiceMock.current, "get").and.returnValue({
				$promise: $q.when(user)
			});

			createPageHeaderController();

			$rootScope.$apply();

			expect(pageHeaderController.user).toBe(user);
			expect(pageHeaderController.isDisabled).toBe(false);
		});

		it("should not set unauthenticated user", function () {
			var user = {
				_id: null
			};

			spyOn(userServiceMock.current, "get").and.returnValue({
				$promise: $q.when(user)
			});

			createPageHeaderController();

			$rootScope.$apply();

			expect(pageHeaderController.user).toBe(null);
			expect(pageHeaderController.isDisabled).toBe(true);
		});

		it("should set user on USER_LOGGED_IN event", function () {
			var user = {
				_id: null
			};

			spyOn(userServiceMock.current, "get").and.returnValue({
				$promise: $q.when(user)
			});

			createPageHeaderController();

			$rootScope.$apply();

			var validUser = {
				_id: 123
			};

			$rootScope.$broadcast(USER_LOGGED_IN, validUser);

			expect(pageHeaderController.user).toBe(validUser);
			expect(pageHeaderController.isDisabled).toBe(false);
		});

		it("should log out", function () {
			var user = {
				_id: null
			};

			spyOn(userServiceMock.current, "get").and.returnValue({
				$promise: $q.when(user)
			});

			spyOn(userServiceMock.current, "logout").and.returnValue({
				$promise: $q.when({})
			});

			spyOn(locationMock, "path");

			createPageHeaderController();

			pageHeaderController.logout();

			$rootScope.$apply();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/user/login");

			expect(pageHeaderController.isDisabled).toBe(true);
		});
	});
});
