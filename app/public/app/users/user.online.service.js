define([], function () {

	function userOnlineService($resource, cacheService) {
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
				method: "GET",
				interceptor: {
	                response: function (data) {
						cacheService.invalidate("/user");
	                },
	                responseError: function (data) {
	                }
	            }
			}
		});

		return resource;
	}

	return userOnlineService;
});
