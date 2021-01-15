const {body} = require('express-validator');

const validation = [
    body('title')
    .notEmpty()
    .withMessage('Title is required.'),
    body('author')
    .notEmpty()
    .withMessage('Author is required.'),
    body('genre')
    .notEmpty()
    .withMessage('Genre is required.'),
    body('price')
    .notEmpty()
    .withMessage('Price is required.')
]

module.exports = validation;