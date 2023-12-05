const { Router } = require('express');
const { LogsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/admin/getLogs",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(LogsController.getLogs)
);
router.delete("/admin/gotozero",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(LogsController.gotozero)
);

module.exports = { router };