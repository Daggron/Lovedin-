let mongoose = require('mongoose');

let comments = mongoose.Schema({
   postedBy:{
       type:String,
   },
    postedOn:{
       type:String,
    },
    timestamp:{
       type:String,
    },
    author:{
       type:String,
    },
    content:{
      type:String,
    }
});

let Comment=module.exports=mongoose.model("comments",comments);

