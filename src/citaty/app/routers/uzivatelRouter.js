const express = require('express');
const router = express.Router();

const controller = require('../controllers/uzivatelController');

router.get('/registrovat', controller.registrace);
router.post('/registrovat', controller.registrovat);
router.get('/prihlasit', controller.prihlaseni);
router.post('/prihlasit', controller.prihlasit);
router.get('/odhlasit', controller.odhlasit);
router.get('/profil', controller.profil);
router.get('/overeni', controller.overeni);
router.post('/overeni', controller.overit);
router.get('/sinslavy', controller.sinslavy);

router.get("/confirmSmazani", controller.confirmSmazani);
router.post("/confirmSmazani", controller.smazatUzivatele);

module.exports = router;