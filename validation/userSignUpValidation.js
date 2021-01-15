const { body } = require('express-validator');
const user = require('../models/user');

const validation = [
    body('email')
    .exists()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be valid.'),
    body('password')
    .isLength({min: 8, max: 32})
    .withMessage('Password must be between 8 and 32 characters.'),
    body('password')
    .matches(/(?=.*[0-9])(?=.*[a-zA-Z])/)   
    .withMessage('Password must contain numbers and letters.'),
    body('confirmPassword')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          return false
        }
        return true;
      })
      .withMessage('Passwords must match.')
]

module.exports = validation;