module.exports.UsersController = {
    ...require('./login'),
    ...require('./auth'),
    ...require('./createAdmin'),
    ...require('./deleteAdmin'),
    ...require('./getUsers')
}