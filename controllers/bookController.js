const Book = require('../models/book');
const {validationResult} = require('express-validator');

exports.getAll = async (req, res, next) => {
    const genre = req.query.genre;
    const sortBy = req.query.orderby;
    const descIndex = req.query.descending === 'true' ? -1 : 1;

    const books = await Book.find(genre ? {genre: genre} : {})
    .sort([[sortBy, descIndex]]).exec()
    .catch(err => next(err));

    return res.json(books);
}

exports.getAllFeatured = async (req, res, next) => {
    const books = await Book.find({featured: true}).exec()
    .catch(err => next(err));

    return res.json(books);
}

exports.getByTitle = async (req, res, next) => {
    const bookTitle = req.params.title;
    Book.findOne({title: bookTitle}, (err, doc) => {
        if(err){
            next(err);
        }

        if(doc === null){
            return res.status(500).send(new Error('Book not found.'));
        }

        return res.json(doc);
    });
}

exports.add = async (req, res, next) => {
    if(!req.user.isAdmin){
        return;
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json(errors);
    }

    Book.findOne({title: req.body.title, author: req.body.author}, async (err, doc) => {
        if(err){
            next(err);
        }

        if(doc){
            return res.json({errors: [{msg: 'Book with this title and author already exists.'}]});
        }else{
            const newBook = new Book({
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                publishedDate: req.body.publishedDate,
                price: req.body.price,
                image: req.body.image,
                description: req.body.description,
                available: req.body.availability,
                featured: req.body.featured
            });
            await newBook.save();
            res.json({errors: [{msg: 'Succesfully created'}]});
        }
    });
}

exports.remove = async (req, res, next) => {
    if(!req.user.isAdmin){
        return;
    }

    const id = req.body.id;
    await Book.find({_id: id}).deleteOne().exec()
    .catch(err => next(err));

    return res.json('Removed');
}

exports.update = async (req, res, next) => {
    if(!req.user.isAdmin){
        return;
    }

    const id = req.body.id;
    const field = req.body.field;
    const value = req.body.value;

    await Book.find({_id: id}).updateOne({$set: {[field]: value}}).exec()
    .catch(err => next(err));
    
    return res.json('Updated');
}