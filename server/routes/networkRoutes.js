const express = require('express');
const { checkNetwork } = require('../controllers/networkController');

const router = express.Router();

router.get('/check', checkNetwork);

module.exports = router;
