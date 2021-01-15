const Genre = require('../models/genre');

exports.getAll = async (req, res, next) => {
    const genres = await Genre.find().sort().exec();
    return res.json(genres);
}