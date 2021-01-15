const express = require('express');
const router = express.Router();
const adminAddValidation = require('../validation/adminAddValidation');
const bookController = require('../controllers/bookController');

router.post('/add', [adminAddValidation], bookController.add);

router.post('/remove', bookController.remove);

router.post('/update', bookController.update);

module.exports = router;