function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.status(401).json({ message: "Unauthorized" });
}

function isAdminUser(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin)
		return next();

	res.status(401).json({ message: "Unauthorized" });
}

module.exports = {
	isAuthenticated: isAuthenticated,
	isAdminUser: isAdminUser
};
