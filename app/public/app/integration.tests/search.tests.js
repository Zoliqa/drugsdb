module.exports = {
	"Login" : function (browser) {
		browser
			.url("http://localhost:4000")
			.waitForElementVisible("#login", 1000)
			.clearValue("#login input.form-control[type='text']")
			.setValue("#login input.form-control[type='text']", "a")
			.clearValue("#login input.form-control[type='password']")
			.setValue("#login input.form-control[type='password']", "a")
			.click("#login button:nth-of-type(1)")
			.pause(1000)
	},

	"Search for DragonTabs and check if results are found" : function (browser) {
		browser
			.url("http://localhost:4000/#/search")
			.waitForElementVisible("#search", 1000)
			.setValue("#search input.form-control", "DragonTabs")
			.click("#search span.glyphicon-search")
			.waitForElementVisible("#search table", 1000)
			.end();
	}
};
