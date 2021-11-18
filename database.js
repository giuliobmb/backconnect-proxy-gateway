
const { Int32, Decimal128 } = require('bson');
const mongoose = require('mongoose');
const { long } = require('webidl-conversions');

const dbUrl = 'mongodb+srv://scuolabar:OpOO3aYVJW7DZSaD@cluster0.gtebm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        .then((result) => {return true})
        .catch((err) => {console.log(err); 
            return false
        });

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bandwith: {
        type: Number,
        required: true
    }
}, {timestamps: true});




const User = mongoose.model('proxyUser', userSchema);

module.exports = User;
