const express = require('express');
const router = express.Router();

const controller = require('../controllers/hlaskyController');

router.get('/random', controller.randomKviz);
router.post('/random', controller.odpovedNaRandomKviz);






module.exports = router; //konec