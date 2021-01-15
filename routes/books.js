const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/getAll', bookController.getAll);

router.get('/getAllFeatured', bookController.getAllFeatured);

router.get('/get/:title', bookController.getByTitle);

module.exports = router;