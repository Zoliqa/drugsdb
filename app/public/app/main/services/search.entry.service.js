define([], function () {

	function searchEntryService($resource) {
		var resource = $resource("/searchentry/:id");

		return resource;
	}

	return searchEntryService;
});
