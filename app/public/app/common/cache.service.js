define([], function () {

	function cacheService($cacheFactory) {
		var service = {
			invalidate: invalidate,
			store: store
		}

		return service;

		function invalidate(key) {
			var $httpDefaultCache = $cacheFactory.get('$http');

			$httpDefaultCache.remove(key);
		}

		function store(key, value) {
			var $httpDefaultCache = $cacheFactory.get('$http');

			$httpDefaultCache.put(key, value);
		}
	}

	return cacheService;
});
