const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator');
const passport = require('passport');
require('../passportConfig')(passport);
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

exports.createUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json(errors);
    }

    User.findOne({email: req.body.email}, async (err, doc) => {
        if(err) next(err);
        if(doc){          
            return res.json({errors: [{msg: 'User already exists.'}]});
        }else{
            const newUser = new User({
                email: req.body.email,
                password: req.body.password
            });
            await newUser.save();
            
            // Send confirmation email, that uses a JSON web token
            jwt.sign(
                {id: newUser._id},
                process.env.EMAIL_SECRET,
                {expiresIn: '1d',},
                (err, emailToken) => {
                  const url = `http://localhost:8000/api/confirmation/${emailToken}`;

                  transporter.sendMail({
                    to: newUser.email,
                    subject: 'Confirm Email',
                    html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
                  });
                }
              );

            res.json({errors: [{msg: 'Succesfully created'}]});
        }
    });
}

exports.authenticateUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json(errors);
    }
    
    passport.authenticate('local', function(err, user) {
      if (err) throw err;
      if (!user){
        return res.json({errors: [{msg: 'Wrong email or password.'}]});
      }
      else if(!user.isConfirmed){
        return res.json({errors: [{msg: 'Please confirm your email.'}]});
      }
      else{
        req.logIn(user, (err) => {
            if (err) throw err;
            return res.json({errors: [{msg: 'Successfully Authenticated'}]});
        });
        }
    })(req, res, next);
}

exports.confirmUser = async (req, res, next) => {
    try {
      const {id} = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
      await User.find({_id: id}).updateOne({$set: {isConfirmed: true}}).exec();
    } catch (e) {
        res.send('error');
    }

    return res.redirect('http://localhost:3000/login');
}