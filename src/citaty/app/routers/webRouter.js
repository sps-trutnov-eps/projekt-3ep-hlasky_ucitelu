const express = require('express');
const router = express.Router();

router.get('/about', require('../controllers/webController').about);
router.get('/error', require('../controllers/webController').error);
router.get('/index', require('../controllers/webController').index);

module.exports = router;
