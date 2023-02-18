const express = require('express');
const router = express.Router();

const controller = require('../controllers/hlaskyController');

router.get('/random', controller.randomKviz);
router.post('/random', controller.odpovedNaRandomKviz);
router.get('/uspesnost', controller.uspesnost);





module.exports = router; //konec