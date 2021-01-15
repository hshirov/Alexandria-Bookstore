const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

router.get('/getAll', genreController.getAll);

module.exports = router;