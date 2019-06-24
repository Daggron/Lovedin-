const express = require('express');
const bodyparser=require('body-parser');
const multer = require('multer');
let urlencoded=bodyparser.urlencoded({extended:false});
const router = express.Router();
const Post = require('../models/posts');
const path= require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const fs = require('fs');
const User = require('../models/users');
const Comment = require('../models/comments');

// using multer disk storage to store the photos uploaded by user
const storage = multer.diskStorage({
    destination: './public/static/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  

  const upload = multer({
    storage: storage,
    // increase the size from 3000000 to let users to upload a file greater than 3 MB the units are bits so that is ehy 3MB is equal to 3000000
    limits:{fileSize: 3000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
      
    }
  }

  

router.get('/',(req,res)=>{
  res.render("home.ejs");
});


router.get('/home',(req,res)=>{

    Post.find({},(err,posts)=>{
        if (err) throw err;
        Comment.find({},(err,comments)=>{
            if (err) throw err;

            res.render('index.ejs',{
                posts:posts,
                comments:comments,
            });

        });
    });
});


  router.post('/home',(req,res)=>{
      // let hour=Date.getHours();
      // let minute=Date.getMinutes();
      let comment = new Comment({
          postedBy: req.user._id,
          postedOn: req.body.postid,
          author:req.user.username,
          content:req.body.content
      });
      comment.save();
      console.log(comment);
      res.redirect('/home');

  });


router.get('/add/stories',(req,res)=>{
    res.render('add.ejs',{title:"Add New Story"});
});



// to post a story
router.post('/add/stories',urlencoded,(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            req.flash('Error',"*Only Images are allowed");
            res.render('add.ejs');
        }
        else{
          if(req.file == undefined){
            req.flash("Error","*Please Select An image File");
            res.render('add.ejs', {
              msg: 'Error: No File Selected!'
            });
          }
          else{
            let post = new Post();
            post.author=req.user.name;
            console.log(post.author+" "+req.user.id+" "+req.user._id);
            post.caption=req.body.caption;
            post.image=`static/${req.file.filename}`;
            post.posted=req.user._id;
            post.userimage=req.user.profile;
            var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            let time = new Date();
            post.timeStamp=months[time.getMonth()]+""+time.getDate();
            
            post.save((err)=>{
              if(err){
                  req.flash('Error',"*"+err+"*");
                  res.render('add.ejs');
              }
              else{
                 req.flash('Success','Article Added');
                  res.redirect('/home');
                  console.log(post);
              }
            });
          }
          }
    });
});


router.get('/home/:id',(req,res)=>{
    Post.findById({_id:req.params.id},(err,posts)=>{
        Comment.find({postedOn:req.params.id},(err,comments)=>{
            res.render('details.ejs',{posts:posts,comments:comments});
        });

    });
});



router.delete('/home/:id',(req,res)=>{
  let query = {_id:req.params.id};
   Post.findById({_id:req.params.id},(err,found)=>{
    console.log(found);
    
    if(req.user._id==found.posted){
    // To remove the file from static folder also so if they are deleted they are removed permanentaly
        fs.unlinkSync('./public/'+found.image,(err)=>{
          if (err) throw err;
        });

        // to remove the post
        Post.deleteOne(found,(err)=>{
          if(err) throw err;
          res.send('success');
        });
  }
  else{
    req.flash('error','You can\'t  delete others article');
    res.send('error');
  }

  });
  
});

// to handle delete requests urls


module.exports=router;