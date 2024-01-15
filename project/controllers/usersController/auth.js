module.exports.auth = async (req, res) => {
    const { login, fullName, accessLevel } = req.user;
    return res.status(200).json({ login, fullName, accessLevel });
}