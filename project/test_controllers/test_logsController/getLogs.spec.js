const { getLogs } = require('../../controllers/logsController/getLogs')

describe('getLogs', () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    const err = new Error;
    const reqErr = jest.fn().mockImplementation(async () => {throw err})

    it('should be opened and throw error 500 and send message', async () => {
        await getLogs(reqErr, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    })



})