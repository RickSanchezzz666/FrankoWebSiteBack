module.exports.auth = async (req, res) => {
    const { u_Login, u_Fullname, u_AccessLevel } = req.user;
    return res.status(200).json({ u_Login, u_Fullname, u_AccessLevel });
}