module.exports.apiWrapper = (handler) => {
    return async (req, res) => {
        try {
            await handler(req, res)
        } catch (err) {
            console.error('ApiWrapper: ', err.toString(), err)
            return res.status(500).send({message: `Внутрішня помилка сервера: ${err.toString()}` })
        }
    }
}