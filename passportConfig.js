const User = require('./models/user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField: 'email'}, (email, password, done) => {
            User.findOne({email: email}, (err, user) => {
                if(err) throw err;
                if(!user) {
                    return done(null, false);
                }
                
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err) throw err;
                    if(result){
                        return done(null, user)
                    } else {
                        return done(null, false);
                    }
                })
            })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        User.findById(id)
        .then(user => {
            done(null ,user);
        })
        .catch(err => done(err))
    });
}