module.exports.auth = async (req, res) => {
	const {
		Login,
		Fullname,
		AccessLevel
	} = req.user;
	return res.status(200).json({
		Login,
		Fullname,
		AccessLevel
	});
}