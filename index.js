const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();
const Book = require('./models/book');
const Genre = require('./models/genre');
const booksSeed = require('./lib/booksSeed');
const genresSeed = require('./lib/genreSeed');
const MongoStore = require('connect-mongo')(session);
require('./passportConfig')(passport);
require('dotenv').config();
const indexRoutes = require('./routes/index');
const basketRoutes = require('./routes/basket');
const booksRoutes = require('./routes/books');
const genresRoutes = require('./routes/genres');
const adminRoutes = require('./routes/admin');
const confirmationRoutes = require('./routes/confirmation');
const path = require('path');
// ---------------------------------------------- END OF IMPORTS ----------------------------------------------

// Connections
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', async () => {
    // Books seed
    const books = await Book.find();
    if(books.length === 0){
        Book.insertMany(booksSeed, (err, docs) => {if(err){console.log(err)}});
    }
    // Genres seed
    const genres = await Genre.find();
    if(genres.length === 0){
        Genre.insertMany(genresSeed, (err, docs) => {if(err){console.log(err)}})
    } 
});
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});
// ---------------------------------------------- END OF CONNECTIONS ----------------------------------------------

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000* 60 * 60 * 24 // 1 day
    }
}));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
// ---------------------------------------------- END OF MIDDLEWARE ----------------------------------------------

// Routes
app.use('/api/books', booksRoutes);
app.use('/api/basket', basketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/confirmation', confirmationRoutes);
app.use('/api/', indexRoutes);
// ---------------------------------------------- END OF ROUTES ----------------------------------------------

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Error handler
app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});

// Start server
app.listen(process.env.PORT);