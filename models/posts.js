const express = require('express');
const mongoose=require('mongoose');

let schema = mongoose.Schema({
    author:{
        type:String
    },
    caption:{
        type:String
    },
    image:{
        type:String
    },
    posted:{
        type:String
    },
    timeStamp:{
        type:String
    },
    userimage:{
        type:String
    }

});

let post = module.exports=mongoose.model('post',schema);