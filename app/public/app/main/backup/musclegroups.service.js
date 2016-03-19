
define(["underscore"], function (_) {
	
	function muscleGroupsService() {
		var groups = {
			1: { id: 1, name: "Chest" },
			2: { id: 2, name: "Lats" },
			3: { id: 3, name: "Biceps" },
			4: { id: 4, name: "Triceps" },
			5: { id: 5, name: "Legs" },
			6: { id: 6, name: "Shoulders" },
			7: { id: 7, name: "Traps" },
			8: { id: 8, name: "Abs" },
			9: { id: 9, name: "Cardio" },
			10: { id: 10, name: "Other" }
		};
		
		return {
			getAll: getAll,
			getById: getById
		};
		
		function getAll() {
			return _.values(groups);
		}
		
		function getById(id) {
			return groups[id];
		}
	}
	
	return muscleGroupsService;
});