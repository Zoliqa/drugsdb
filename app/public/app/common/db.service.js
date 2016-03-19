
define([], function () { 

		function dbService(Dexie) {
			var db;
			var service = {
				saveUser: saveUser,
				getUser: getUser,
				getAllUsers: getAllUsers,
			};
		
			init();
		
			return service;
		
			function init() {
				db = new Dexie("fitappdb");
			
				db.version(1).stores({
					users: "_id, username, password, firstname, lastname, email, gender, birthdate"
				});
			
				db.version(2).stores({
					users: "_id, username, password, firstname, lastname, email, gender, birthdate"
				}).upgrade(function (trans) { 
					trans.users.clear();	
				});
			
				Dexie.Promise.on('error', function (err) {
					console.log("Uncaught error: " + err);
				});
			
				db.on('blocked', function () {
					debugger;
				});
			
				db.open();
			}
		
			function saveUser(user) {
				db.users.put(user);
			}
		
			function getUser(id) {
				return db.users.get(id);
			}

			function getAllUsers() {
				return db.users.toArray();
			}
		}

		return dbService;
	}
);