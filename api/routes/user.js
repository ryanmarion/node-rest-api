const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup',(req,res,next)=>{
  User.find({email:req.body.email})
    .exec()
    .then(user => {
      //check if a user with req.body.email exists
      if(user.length >= 1){
        return res.status(422).json({
          message:'Email already exists - use a different email'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err,hash)=>{
          //check for any errors in hashing the password and creating the user
          if (err) {
            return res.status(500).json({
              error:err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email:req.body.email,
              password: hash
            });

            //save our user to the db
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message:'User created'
                })
              })
              .catch(err=>{
                console.log(err);
                res.status(500).json({
                  error:err
                })
              });
          }
        });
      }
    });
});

router.post('/login',(req,res,next)=>{
  User.find({email:req.body.email})
    .exec()
    .then(users => {
      if(users.length < 1){
        return res.status(401).json({
          message:'Auth failed'
        });
      }

      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if(err){
          return res.status(401).json({
            message:'Auth failed'
          });
        }

        if(result){ //bcrypt.compare returns true if password and hash match
          const token = jwt.sign(
            {
            email:users[0].email,
            userId:users[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn:"1h"
            }
          );

          return res.status(200).json({
            message:'Auth successful',
            token:token
          });
        }

        //no errors, but auth fails
        res.status(401).json({
          message:'Auth failed'
        });

      });
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
});

router.delete('/:userId',(req,res,next)=>{
  const id = req.params.userId;

  User.deleteOne({
    _id:id
  })
  .exec()
  .then(result => {
    res.status(200).json({
      message:'User deleted successfully'
    });
  })
  .catch(err => {
    res.status(500).json({
      error:err
    });
  });
});

module.exports = router;
