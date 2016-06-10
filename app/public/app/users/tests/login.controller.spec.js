define(["angularMocks", "public/app/users/login.controller"], function (angularMocks, LoginController) {

	describe("LoginController", function () {
		var $q,
			$rootScope,
			locationMock,
			USER_LOGGED_IN = 1;

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			locationMock = {
				search: function () {
					return {
						username: "username"
					}
				},
				path: function () {}
			};
		}));

		it("should be defined", function () {
			expect(LoginController).toBeDefined();
		});

		it("should show error message if username is missing", function () {
			var loginController = new LoginController($rootScope, locationMock);

			loginController.credentials.username = "";
			loginController.credentials.password = "password";

			loginController.logIn();

			expect(loginController.errorMessage).toBeTruthy();
		});

		it("should show error message if password is missing", function () {
			var loginController = new LoginController($rootScope, locationMock);

			loginController.credentials.username = "username";
			loginController.credentials.password = "";

			loginController.logIn();

			expect(loginController.errorMessage).toBeTruthy();
		});

		it("should notify subscribers that the user has successfully logged in and should invalidate cache", function () {
			var user = {
				_id: 123,
				username: "Joe",
				password: "123"
			},
			userServiceMock = {
				current: {
				 	login: function () {
						return {
							$promise: $q.when(user)
						}
					}
				}
			},
			cacheServiceMock = {
				invalidate: function () {}
			};

			spyOn($rootScope, "$emit");
			spyOn(cacheServiceMock, "invalidate");

			var loginController = new LoginController($rootScope, locationMock, userServiceMock, cacheServiceMock, USER_LOGGED_IN);

			loginController.credentials.username = user.username;
			loginController.credentials.password = user.password;

			loginController.logIn();

			$rootScope.$apply();

			expect(loginController.errorMessage).toBeFalsy();
			expect($rootScope.$emit).toHaveBeenCalled();
			expect($rootScope.$emit.calls.argsFor(0)).toEqual([USER_LOGGED_IN, user]);

			expect(cacheServiceMock.invalidate).toHaveBeenCalled();
			expect(cacheServiceMock.invalidate.calls.argsFor(0)[0]).toEqual("/user");
		});

		it("should show error message for invalid user", function () {
			var userServiceMock = {
				current: {
				 	login: function () {
						return {
							$promise: $q.when({
								_id: null
							})
						}
					}
				}
			},
			cacheServiceMock = {
				invalidate: function () {}
			};

			spyOn(cacheServiceMock, "invalidate");

			var loginController = new LoginController($rootScope, locationMock, userServiceMock, cacheServiceMock, USER_LOGGED_IN);

			loginController.credentials.username = "John";
			loginController.credentials.password = "Password";

			loginController.logIn();

			$rootScope.$apply();

			expect(loginController.errorMessage).toBeTruthy();

			expect(cacheServiceMock.invalidate).toHaveBeenCalled();
			expect(cacheServiceMock.invalidate.calls.argsFor(0)[0]).toEqual("/user");
		});

		it("should redirect user to register page", function () {
			spyOn(locationMock, "path");

			var loginController = new LoginController($rootScope, locationMock);

			loginController.register();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toEqual("/user/register");
		});
	});
});
