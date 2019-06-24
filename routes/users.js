const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
let urlencoded = bodyParser.urlencoded({extended: false});
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const Post = require('../models/posts');
const passport = require('passport');
const config = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');









//for mailing the confirmation mail



//for storing photos uploaded by user
const storage = multer.diskStorage({
    destination: './public/profile/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


//for uploading and naming file
const upload = multer({
    storage: storage,
    // increase the size from 3000000 to let users to upload a file greater than 3 MB the units are bits so that is ehy 3MB is equal to 3000000
    limits: {fileSize: 9000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profilephoto');

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');

    }
}


router.get('/', (req, res) => {
    User.find({isActive:true}, (err, users) => {
        if (err) {
            console.log(err);
        }
        res.render('users.ejs', {users: users});
    });
    //kennyTheCleaner();
});


//For registeration
router.get('/register', (req, res) => {
    res.render('registeration', {errors: ''});

       User.remove({isActive:false},(err)=>{
           if (err) throw err;
           console.log("Kenny dit it");
           console.log("Deleted by Kenny The Cleaner Vtriggerrrrrrrrrrrrrrrrrrrrrrrrrrrrr!!!!!!!!!!!!!!!!!!");
       });

});


//User Registeration Form
router.post('/register', urlencoded, (req, res) => {

    upload(req, res, (err) => {
        const name = req.body.name;
        const email = req.body.email;
        const unmae = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;
        const phone = req.body.phoneNumber;
        const bio = req.body.bio;
        const profile=req.body.profile;
        const type=req.body.type;

        console.log(name + " " + email + " " + password + " " + password2 + " " + unmae);
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Password Do not Match').equals(req.body.password);
        req.checkBody('phoneNumber', 'Please Enter a valid phone number').notEmpty();
        req.checkBody('type','Please Select your current love life status').notEmpty();
        let errors = req.validationErrors();

        if (errors) {
            res.render('registeration', {errors: errors});
            console.log(errors);


        } else {
            console.log(phone);
            let query=({email:email});



            User.findOne(query, (err, found) => {

                console.log(found);

                if (found) {
                    if (found.email == email) {
                        req.flash('Error', 'Email already exists');
                    }
                    if (found.phone === phone) {
                        req.flash('Error', 'Phone Number already exists');
                    }
                    if (found.username === unmae) {
                        req.flash('Error', 'Username already exists');
                    }
                    res.render('registeration', {errors: errors});
                    console.log(found);

                } else {

                    const user = new User({
                        name: name,
                        username: unmae,
                        email: email,
                        password: password,
                        phone: phone,
                        bio: bio,
                        profile:`profile/${req.file.filename}`,
                        token:Math.floor(Math.random()*1000000)+1,
                        isActive:false,
                        State:'active',
                        role:'enduser',
                        type:type

                    });
                    console.log("Token"+user.token);


                    //Hashing the password in order to keep the user password save
                    //the hasing is of 10 characters change the value below if you want  a high level security the hashing algo used is MD5

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if (err) {
                                console.log(err);
                            }
                            user.password = hash;
                            user.save((err) => {
                                if (err) {
                                    console.log(err);
                                } else {

                                    const transporter= nodemailer.createTransport({
                                        service:'gmail',
                                        auth:{
                                            user:'returnofking04@gmail.com',
                                            pass:'dixit1111'
                                        }
                                    });

                                    var mailOptions={
                                        form:'returnofking04@gmail.com',
                                        to:`${user.email}`,
                                        subject:"Otp from Lovedin",
                                        text:`Your Otp is ${user.token}`

                                    };

                                    transporter.sendMail(mailOptions,(err,info)=>{
                                        if(err ) throw  err;
                                        console.log("Mail Sent");
                                    });


                                    req.flash('success', 'Fill The otp here sent to you by your email');
                                    res.redirect('verify');

                                }
                            });

                        });
                    });

                }
            });
        }
    });


});




router.get('/verify',(req,res)=>{
    res.render('Verify');
});

router.post('/verify',(req,res)=>{

   let query={email:req.body.username};
   User.findOne(query,(err,found)=>{
       if(found){
           if(found.token==req.body.token){
               console.log(req.body.token);
               found.isActive=true;
               found.save();

               req.flash("Success","You Have registered successfully");
               res.redirect('login');
           }
           else{
               req.flash("Error","Wrong OTP");
               res.redirect('verify');

           }
       }
       else{
           req.flash("Error","Please Register First");
           res.redirect('register');
       }
   })
});






router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', urlencoded, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});

//Logout router

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('Success', 'You are logged out successfully');
    res.redirect('/');

});


router.get('/update/:id', (req, res) => {
  User.findOne({_id:req.params.id},(err,found)=>{
      if(err) throw err;
      res.render("update",{found:found});
  })

});


router.post('/update/:id', urlencoded, (req, res) => {

    User.findOne({_id:req.params.id},(err,found)=>{
        upload(req, res, (err) => {
            if(err) throw err;
            else {
                let user = {};
                if (found.profile === req.body.profile) {
                    user.bio = req.body.bio;
                } else {
                    user.profile = `profile/${req.file.filename}`;
                    user.bio = req.body.bio;
                }

                let query = {_id: req.params.id};
                User.update(query, user, (err) => {
                    res.send("Hello");
                    console.log(user);
                });
            }
        });
    });



});

router.get('/follow/:id', (req, res) => {
    let ab = req.params.id;
    User.findById(req.user.id, (err, user) => {
        user.following.push(ab);
        user.save();
        User.findById(ab, (err, found) => {
            found.follower.push(req.user.id);
            found.save();
        });
        res.redirect(`/users/` + ab);

    });


});


router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
        }
        Post.find({posted: user.id}, (err, posts) => {
            if (err) {
                console.log(err);
            }
            res.render('profile.ejs', {posts: posts, user: user});

        });
    });
});


router.delete('/:id', (req, res) => {
    let query = {_id: req.params.id};
    User.findById({_id: req.params.id}, (err, found) => {
        console.log(found);



       Post.remove({posted:req.params.id},(err)=>{
           if(err) throw  err;
       });
        User.deleteOne(found, (err) => {
            if (err) throw err;
            res.send('success');
        });

    });

});




module.exports = router;
