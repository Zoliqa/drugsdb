define(["angular"], function (angular) {

	function userOfflineService($q, _, bcrypt, dbService) {
		var loggedInUserId;
		var service = {
			get: get,
			update: update,
			login: login,
			logout: logout
		};

		return service;

		function get() {
			if (loggedInUserId)
				return {
					$promise: dbService.getUser(loggedInUserId)
				};

			return {
				$promise: $q.when({})
			};
		}

		function update(params, user) {
			return dbService.save(user);
		}

		function login(credentials) {
			var deferred = $q.defer();

			dbService.getAllUsers().then(function (users) {
				var currentUser = _.find(users, function (user) {
					var isMatch = credentials.username === user.username && bcrypt.compareSync(credentials.password, user.password);

					return isMatch;
				});

				if (currentUser)
					loggedInUserId = currentUser._id;
				else
					loggedInUserId = null;

				deferred.resolve(get().$promise);
			});

			return {
				$promise: deferred.promise
			};
		}

		function logout() {
			loggedInUserId = null;

			return {
				$promise: $q.when({})
			};
		}
	}

	return userOfflineService;
});
