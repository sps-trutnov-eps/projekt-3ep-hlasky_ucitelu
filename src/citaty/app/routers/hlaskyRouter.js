const express = require('express');
const router = express.Router();

const controller = require('../controllers/hlaskyController');

router.get('/random', controller.randomUcitel);




module.exports = router; //konec