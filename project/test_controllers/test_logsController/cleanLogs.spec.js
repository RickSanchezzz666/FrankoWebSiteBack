const { cleanLogs } = require('../../controllers/logsController/cleanLogs')

describe('cleanLogs', () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    // const req = {
    //     user: {
    //         accessLevel: 2
    //     }
    // }

    const err = new Error;
    const reqErr = jest.fn().mockImplementation(async () => {throw err})

    it('should be opened and throw error 500 and send message', async () => {
        await cleanLogs(reqErr, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    })

})