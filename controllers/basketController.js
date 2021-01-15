const Book = require('../models/book');
const Basket = require('../models/basket');

exports.add = (req, res, next) => {
    const bookId = req.params.id;
    const basket = new Basket(req.session.basket ? req.session.basket : {});

    Book.findById(bookId, (err, doc) => {
        if(err){
            next(err);
        }
        basket.add(doc, doc.id);
        req.session.basket = basket;
        return res.send('/');
    })
    .catch(() => res.send('/error'));
}

exports.remove = (req, res, next) => {
    const bookId = req.params.id;
    const basket = new Basket(req.session.basket);

    basket.remove(bookId);
    
    if(basket.totalQuantity === 0){
        req.session.basket = null;
    }
    else{
        req.session.basket = basket;
    }

    return res.send('/');
}

exports.getItems = (req, res, next) => {
    if(req.session.basket){
        const basket = new Basket(req.session.basket);
        return res.json({'array': basket.items, 'totalPrice': basket.totalPrice});
    }

    return res.send('emptyBasket');
}

exports.getQuantity = (req, res, next) => {
    if(req.session.basket){
        const basket = new Basket(req.session.basket);
        return res.json(basket.totalQuantity);
    }

    return res.json(0);
}