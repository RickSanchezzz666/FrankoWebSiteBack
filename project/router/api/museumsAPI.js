const { Router } = require('express');
const { MuseumsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/getMuseums", apiWrapper(MuseumsController.getMuseums));
router.post("/admin/addMuseum",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(MuseumsController.addMusuem)
);
router.delete("/admin/deleteMusuem",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(MuseumsController.deleteMusuem)
);

module.exports = { router };