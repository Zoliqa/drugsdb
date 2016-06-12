define(["angularMocks", "app/users/login.controller"], function (angularMocks, LoginController) {

	describe("LoginController", function () {
		var $q,
			$rootScope,
			locationMock,
			userServiceMock,
			cacheServiceMock,
			USER_LOGGED_IN = 1,
			loginController;

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

			userServiceMock = {
				current: {
				 	login: function () {
					}
				}
			};

			cacheServiceMock = {
				invalidate: function () {}
			}
		}));

		function createLoginController() {
			loginController = new LoginController($rootScope, locationMock, userServiceMock, cacheServiceMock, USER_LOGGED_IN);
		}

		it("should be defined", function () {
			expect(LoginController).not.toBeNull();
		});

		it("should show error message if username is missing", function () {
			createLoginController();

			loginController.credentials.username = "";
			loginController.credentials.password = "password";

			loginController.logIn();

			expect(loginController.errorMessage).toBeTruthy();
		});

		it("should show error message if password is missing", function () {
			createLoginController();

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
			};

			spyOn(userServiceMock.current, "login").and.returnValue({
				$promise: $q.when(user)
			});

			spyOn($rootScope, "$emit");
			spyOn(cacheServiceMock, "invalidate");

			createLoginController();

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
			spyOn(userServiceMock.current, "login").and.callFake(function () {
				return {
					$promise: $q.when({})
				};
			});

			spyOn(cacheServiceMock, "invalidate");

			createLoginController();

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

			createLoginController();

			loginController.register();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toEqual("/user/register");
		});
	});
});
