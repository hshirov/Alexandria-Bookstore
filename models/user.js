const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

user.pre('save', async function(next){
    try{
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }catch(error){
        next(error);
    }
});

module.exports = mongoose.model("User", user);