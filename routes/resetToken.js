// this routehandler handles request for participant collection
const crypto = require('crypto');
const { User }  = require('../models/user');
const express = require('express');
const router = express.Router();

  router.get('/', async (req, res) => {
      console.log(req.query.resetPasswordToken);
      User.findOne({
              resetPasswordToken: req.query.resetPasswordToken,
              resetPasswordExpires:{
                  $gt:Date.now(),
              }
      }).then( user => {
          if(user == null) {
              console.log(user);
              res.json('password reset link is invalid or has expired');
          }else {
            console.log(user);
              res.status(200).send({
                
                  userName: user.userName,
                  message:'reset link ok'
              });
          }
      });
      
 });

module.exports = router;