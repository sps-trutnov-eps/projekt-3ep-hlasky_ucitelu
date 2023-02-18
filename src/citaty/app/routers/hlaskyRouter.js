const express = require('express');
const router = express.Router();

const controller = require('../controllers/hlaskyController');

router.get('/random', controller.randomKviz);
router.post('/random', controller.odpovedNaRandomKviz);
router.get('/uspesnost', controller.uspesnost);
router.pos('/uspesnost', controller.procentaUspesnosti);




module.exports = router; //konec