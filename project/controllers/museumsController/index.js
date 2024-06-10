module.exports.MuseumsController = {
    ...require('./addMuseum'),
    ...require('./editMuseum'),
    ...require('./deleteMuseum'),
    ...require('./getMuseums'),
    ...require('./getMuseumAdmin')
}