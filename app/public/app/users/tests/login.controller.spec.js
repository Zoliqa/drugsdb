
define(["angularMocks", "public/app/users/users.module"], 
	function (angularMocks, usersModule) {
	
	describe("LoginController", function () {
		var $controller, $httpBackend, loginController, $locationMock, $scopeMock, cacheServiceMock, USER_LOGGED_IN; 

		beforeEach(module("users"));
		
		beforeEach(inject(function ($injector) {
			$controller = $injector.get("$controller");
			
			$httpBackend = $injector.get("$httpBackend");
			
			USER_LOGGED_IN = $injector.get("USER_LOGGED_IN");

			// suppose the user is not logged in, i.e. doesn't have any cookies in the browser which stores his/her identity
			$httpBackend.whenGET("/user").respond(null);

			$scopeMock = $injector.get("$rootScope");
			
			cacheServiceMock = {
				invalidate: function (path) { 
				}
			};
			
			$locationMock = {
				hash: '/not-changed',
				updateHash: function (hash) {
					this.hash = hash;
				},
				search: function () {
					return {
						username: "username"
					}
				},
				path: function () { 
				}
			};
			
			loginController = $controller("LoginController", {
				$scope: $scopeMock,
				$location: $locationMock,
				cacheService: cacheServiceMock
			});
		}));

		it("should create the LoginController", function () { 
			expect(loginController).toBeDefined();
		});

		it("should show error message if username is missing", function () {
			loginController.isUsernameEmpty = function () {
				return true;
			};

			loginController.isPasswordEmpty = function () {
				return false;
			};

			loginController.logIn();

			expect(loginController.errorMessage).toBe("Username and/or password is empty");
		});

		it("should show error message if password is missing", function () {
			loginController.isUsernameEmpty = function () {
				return false;
			};
			
			loginController.isPasswordEmpty = function () {
				return true;
			};
			
			loginController.logIn();
			
			expect(loginController.errorMessage).toBe("Username and/or password is empty");
		});

		it("should set the logged in user in the service for existing user and notify scope that user is logged in", function () {
			var user = {
				username: "Joe",
				password: "123"
			};

			$httpBackend.whenPOST("/user/login").respond(user);
			
			loginController.credentials.username = user.username;
			loginController.credentials.password = user.password;
			
			spyOn($scopeMock, "$emit");
			spyOn(cacheServiceMock, "invalidate");

			loginController.logIn();
			
			$httpBackend.flush();  

			expect($scopeMock.$emit).toHaveBeenCalled();
			expect($scopeMock.$emit.calls.argsFor(0)).toEqual([USER_LOGGED_IN]);

			expect(cacheServiceMock.invalidate).toHaveBeenCalled();
			expect(cacheServiceMock.invalidate.calls.argsFor(0)).toEqual(["/user"]);
		});

		it("should show error message for user who doesn't exist", function () {
			var user = {
				username: "Joe",
				password: "123"
			};
			
			$httpBackend.whenPOST("/user/login").respond(null);
			
			loginController.credentials.username = user.username;
			loginController.credentials.password = user.password;
			
			spyOn(cacheServiceMock, "invalidate");

			loginController.logIn();
			
			$httpBackend.flush();
			
			expect(loginController.errorMessage).toBe("Wrong username and/or password");

			expect(cacheServiceMock.invalidate).toHaveBeenCalled();
			expect(cacheServiceMock.invalidate.calls.argsFor(0)[0]).toEqual("/user");
		});

		it("should redirect user to register page", function () { 
			spyOn($locationMock, "path");

			loginController.register();

			expect($locationMock.path).toHaveBeenCalled();
			expect($locationMock.path.calls.argsFor(0)[0]).toEqual("/user/register");
		});
	});
});