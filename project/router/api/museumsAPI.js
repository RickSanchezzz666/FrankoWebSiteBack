const { Router } = require('express');
const { MuseumsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/getMuseums/:museumId?", apiWrapper(MuseumsController.getMuseums));
router.get("/admin/getMuseumAdmin/:museumId?",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(MuseumsController.getMuseumAdmin)
);
router.post("/admin/addMuseum",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(MuseumsController.addMuseum)
);
router.delete("/admin/deleteMuseum",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(MuseumsController.deleteMuseum)
);

module.exports = { router };