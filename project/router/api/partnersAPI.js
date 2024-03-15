const { Router } = require('express');
const { PartnersController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/getPartners", apiWrapper(PartnersController.getPartners));
router.post("/admin/addPartner",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PartnersController.addPartner)
);
router.delete("/admin/deletePartner",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PartnersController.deletePartner)
);

module.exports = { router };