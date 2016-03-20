define([], function () {

	function userOnlineService($resource) {
		var resource = $resource("/user/:id/:username", null, {
			"get": {
				cache: true
			},
			"getByUsername": { method: "GET" },
			"update": { method: "PUT" },
			"login": {
				url: "/user/login",
				method: "POST"
			},
			"logout": {
				url: "/user/logout",
				method: "GET"
			}
		});

		return resource;
	}

	return userOnlineService;
});
