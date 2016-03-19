
define([], function () { 

		function utilityService() {
			var service = {
				generateGuid: generateGuid,
				isGuid: isGuid
			};
		
			return service;
		
			function generateGuid() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
				}

				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			}

			function isGuid(value) {
				return !!/^([^-]+-){4}[^-]+$/.exec(value);	
			}
		}

		return utilityService;
	}
);