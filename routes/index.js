const express = require('express');
const router = express.Router();
const signUpValidation = require('../validation/userSignUpValidation');
const logInValidation = require('../validation/userLogInValidation');
const userController = require('../controllers/userController');

router.post('/signup', [signUpValidation], userController.createUser);

router.post('/login', [logInValidation], userController.authenticateUser);

router.get('/checkAuthentication', (req, res) => {
    return res.send(req.isAuthenticated());
});

router.get('/checkAdminAuthentication', (req, res) => {
    return res.send(req.user.isAdmin);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('/');
});

module.exports = router;