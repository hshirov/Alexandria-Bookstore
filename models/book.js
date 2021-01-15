const mongoose = require('mongoose');

const book = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        required: true
    },
    featured: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model("Book", book);