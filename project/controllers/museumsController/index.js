module.exports.MuseumsController = {
    ...require('./addMuseum'),
    ...require('./deleteMuseum'),
    ...require('./getMuseums'),
    ...require('./getMuseumAdmin')
}