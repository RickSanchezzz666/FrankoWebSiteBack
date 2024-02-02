"use strict";

var _require = require('../../controllers/logsController/cleanLogs'),
    cleanLogs = _require.cleanLogs;

var originalLoggerModule = require('../../controllers/logger').loggerModule;

jest.mock('../../controllers/logger', function () {
  return {
    loggerModule: jest.fn()
  };
});
describe('cleanLogs', function () {
  var res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
  var err = new Error();
  var reqErr = jest.fn().mockImplementation(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            throw err;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('should be opened and throw error 500 and send message and logs', function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(cleanLogs(reqErr, res));

          case 3:
            _context2.next = 11;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            originalLoggerModule.mockImplementation(function () {
              return Promise.resolve();
            });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
              message: "Внутрішня помилка сервера, зверніться до технічного адміністратора"
            });
            expect(originalLoggerModule).toHaveBeenCalledWith("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430, ".concat(_context2.t0), "Console");

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 5]]);
  });
  it('should be opened and return error 403 and message', function _callee3() {
    var req;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            req = {
              user: {
                accessLevel: 2,
                fullName: "Tommy Vercetti"
              },
              query: {
                key: process.env.LOGS_KEY
              }
            };
            _context3.next = 3;
            return regeneratorRuntime.awrap(cleanLogs(req, res));

          case 3:
            originalLoggerModule.mockImplementation(function () {
              return Promise.resolve();
            });
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
              message: "Ваш рівень доступу недостатній"
            });
            expect(originalLoggerModule).toHaveBeenCalledWith("\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u043F\u0440\u0430\u0432: \u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 ".concat(req.user.fullName, " \u0441\u043F\u0440\u043E\u0431\u0443\u0432\u0430\u0432 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0441\u0435\u0440\u0432\u0435\u0440-\u043B\u043E\u0433"), "Console");

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});