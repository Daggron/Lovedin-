const express = require('express');
const mongoose = require('mongoose');


let schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String

    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    role:{
        type:String
    },
    isActive:{
        type:String
    },
    token:{
        type:String
    },

});


let admin = module.exports=mongoose.model('Admin',schema);