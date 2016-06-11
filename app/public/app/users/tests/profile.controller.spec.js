define(["angularMocks", "public/app/users/profile.controller"], function (angularMocks, ProfileController) {

	describe("ProfileController", function () {
		var bcryptMock,
			userServiceMock,
			cacheServiceMock,
			profileController,
			user = {
				password: "currentPassword"
			};

		beforeEach(inject(function ($q) {
			bcryptMock = {
				compareSync: function () {},
				genSaltSync: function () {},
				hashSync: function () {}
			},
			userServiceMock = {
				current: {
				 	get: function () {
						return user;
					},
					update: function () {

					}
				}
			};

			cacheServiceMock = {
				invalidate: function () {}
			};
		}));

		function createProfileController() {
			profileController = new ProfileController(bcryptMock, userServiceMock, cacheServiceMock);
		}

		it("should be defined", function () {
			expect(ProfileController).toBeDefined();
		});

		describe("save", function () {
			it("should update user without changing password", function () {
				createProfileController();

				profileController.shouldChangePassword = false;

				profileController.save();

				expect(user.password).toBe("currentPassword");
				expect(profileController.errorMessage).toBe("");
			});

			it("should update user", function () {
				createProfileController();

				profileController.shouldChangePassword = false;

				spyOn(userServiceMock.current, "update").and.callFake(function (user, callback) {
					callback();
				});

				spyOn(cacheServiceMock, "invalidate");

				profileController.shouldChangePassword = null;

				profileController.save();

				expect(userServiceMock.current.update).toHaveBeenCalled();
				expect(userServiceMock.current.update.calls.argsFor(0)[0]).toBe(user);

				expect(profileController.shouldChangePassword).toBe(false);

				expect(profileController.errorMessage).toBe("");
				expect(profileController.resultMessage).toBeTruthy();

				expect(cacheServiceMock.invalidate).toHaveBeenCalled();
				expect(cacheServiceMock.invalidate.calls.argsFor(0)[0]).toEqual("/user");
			});

			it("should not change password if old one is not correct", function () {
				createProfileController();

				profileController.shouldChangePassword = true;

				spyOn(bcryptMock, "compareSync").and.returnValue(false);

				spyOn(userServiceMock.current, "update");

				profileController.save();

				expect(profileController.errorMessage).toBeTruthy();

				expect(userServiceMock.current.update).not.toHaveBeenCalled();
			});

			it("should not change password if confirmed is not equal to the new one", function () {
				createProfileController();

				profileController.shouldChangePassword = true;

				spyOn(bcryptMock, "compareSync").and.returnValue(true);

				spyOn(userServiceMock.current, "update");

				profileController.user.newPassword = "NewPassword";
				profileController.user.confirmedNewPassword = "ConfirmedNewPasswordWhichIsDifferentThanTheNewOne";

				profileController.save();

				expect(profileController.errorMessage).toBeTruthy();

				expect(userServiceMock.current.update).not.toHaveBeenCalled();
			});

			it("should change password", function () {
				createProfileController();

				profileController.shouldChangePassword = true;

				spyOn(bcryptMock, "compareSync").and.returnValue(true);
				spyOn(bcryptMock, "hashSync").and.returnValue("HashedPassword");

				spyOn(userServiceMock.current, "update");

				profileController.user.newPassword = "NewPassword";
				profileController.user.confirmedNewPassword = "NewPassword";

				profileController.save();

				expect(profileController.user.password).toBe("HashedPassword");

				expect(profileController.errorMessage).toBe("");

				expect(userServiceMock.current.update).toHaveBeenCalled();
			});
		});

		it("should define correct term service providers", function () {
			createProfileController();

			expect(profileController.termServiceProviders).toBeDefined();
			expect(profileController.termServiceProviders["termDbpediaService"]).toBe("DBPedia");
			expect(profileController.termServiceProviders["termMedlinePlusService"]).toBe("MedlinePlus");
		});

		it("should select correct term service provider", function () {
			createProfileController();

			var fakeTermServiceProvider = "Service";

			profileController.selectTermServiceProvider(fakeTermServiceProvider);

			expect(user.termServiceProvider).toBe(fakeTermServiceProvider);
		});
	});
});
