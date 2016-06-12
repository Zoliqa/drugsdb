module.exports = {
	"Test login and logout" : function (browser) {
		browser
			.url("http://localhost:4000")
			.waitForElementVisible("#login", 1000)
			.clearValue("#login input.form-control[type='text']")
			.setValue("#login input.form-control[type='text']", "a")
			.clearValue("#login input.form-control[type='password']")
			.setValue("#login input.form-control[type='password']", "a")
			.click("#login button:nth-of-type(1)")
			.pause(1000)
			.assert.elementPresent("#search")
			.assert.elementPresent(".navbar .navbar-right a")
			.click(".navbar .navbar-right a")
			.pause(1000)
			.assert.elementPresent("#login")
			.end();
	}
};
