const mongoose = require('mongoose');
const Schema=mongoose.Schema;

var usersSchema= new Schema({
    FullName: {
        type: String,
        required: true
    },
    EmailId: {
        type: String,
        required: true,
        unique: true
    },
    Age: {
        type: Number,
        min: 18,
        max: 65,
        required: true
    },
    AmountPaid: {
        type: Number,
        default: 0
    }
},{timestamps: true});

var YogaUsers=mongoose.model('YogaUsers',usersSchema);
module.exports=YogaUsers;