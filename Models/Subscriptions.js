const mongoose = require('mongoose');
const Schema=mongoose.Schema;

var subSchema= new Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YogaUsers'
    },
    Money: {
        type: Number
    },
    Shift: {
        type: Number,
        min: 1, 
        max: 4
    },
    PaymentTime: {
        type: String, 
        required: true
    },
    ExpirationDate: {
        type: String,
        unique: false
    }
},{timestamps: true});

var Subscriptions=mongoose.model('Subscriptions',subSchema);
module.exports=Subscriptions;