define(["angularMocks", "app/users/register.controller"], function (angularMocks, RegisterController) {

	describe("RegisterController", function () {
		var $q,
			$rootScope,
			locationMock,
			bcryptMock,
			userServiceMock,
			registerController,
			user = {
				password: "currentPassword"
			};

		beforeEach(inject(function (_$q_, _$rootScope_) {
			$q = _$q_;
			$rootScope = _$rootScope_;

			locationMock = {
				path: function () {}
			};

			bcryptMock = {
				compareSync: function () {},
				genSaltSync: function () {},
				hashSync: function () {}
			};

			userServiceMock = {
				current: {
				 	getByUsername: function () {},
					save: function () {}
				}
			};
		}));

		function createRegisterController() {
			registerController = new RegisterController(locationMock, bcryptMock, userServiceMock);
		}

		it("should be defined", function () {
			expect(RegisterController).toBeDefined();
		});

		describe("register", function () {
			it("should show error message if password doesn't match confirmed password", function () {
				createRegisterController();

				registerController.user.password = "Password";
				registerController.user.confirmedPassword = "ConfirmedPasswordThatDoesntMatchThePassword";

				registerController.register();

				expect(registerController.errorMessage).toBeTruthy();
			});

			it("should show error message when username is taken", function () {
				spyOn(userServiceMock.current, "getByUsername").and.returnValue({
					$promise: $q.when({
						_id: 123
					})
				});

				createRegisterController();

				registerController.user.password = "Password";
				registerController.user.confirmedPassword = "Password";

				registerController.register();

				$rootScope.$apply();

				expect(registerController.errorMessage).toBeTruthy();
			});

			it("should save correct user and redirect to login page", function () {
				spyOn(userServiceMock.current, "getByUsername").and.returnValue({
					$promise: $q.when({
						_id: null
					})
				});

				spyOn(userServiceMock.current, "save").and.callFake(function (user, callback) {
					callback();
				});

				createRegisterController();

				registerController.user.password = "Password";
				registerController.user.confirmedPassword = "Password";

				spyOn(bcryptMock, "hashSync").and.returnValue("HashedPassword");
				spyOn(locationMock, "path");

				registerController.register();

				$rootScope.$apply();

				expect(registerController.errorMessage).toBe("");

				expect(userServiceMock.current.save).toHaveBeenCalled();
				expect(userServiceMock.current.save.calls.argsFor(0)[0]).toBe(registerController.user);

				expect(locationMock.path).toHaveBeenCalled();
				expect(locationMock.path.calls.argsFor(0)[0]).toBe("/login");
			});
		});

		it("cancel should redirect to login page", function () {
			createRegisterController();

			spyOn(locationMock, "path");

			registerController.cancel();

			expect(locationMock.path).toHaveBeenCalled();
			expect(locationMock.path.calls.argsFor(0)[0]).toBe("/login");
		});

		it("should define correct term service providers", function () {
			createRegisterController();

			var fakeTermServiceProvider = "Service";

			registerController.selectTermServiceProvider(fakeTermServiceProvider);

			expect(registerController.user.termServiceProvider).toBe(fakeTermServiceProvider);
		});
	});
});
