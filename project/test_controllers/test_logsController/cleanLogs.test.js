const { cleanLogs } = require('../../controllers/logsController/cleanLogs')

const res = {
    send: jest.fn(),
    status: jest.fn().mockImplementation(() => res)
}

const req = {
    user: {
        access_level: 2
    }
}