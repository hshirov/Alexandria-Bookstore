const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

router.get('/add/:id', basketController.add);

router.get('/remove/:id', basketController.remove);

router.get('/clear', (req, res) => {
    req.session.basket = null;
    return res.send('/');
});

router.get('/getItems', basketController.getItems);

router.get('/getQuantity', basketController.getQuantity);

module.exports = router;