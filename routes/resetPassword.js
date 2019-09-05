// this routehandler handles request for participant collection
const crypto = require('crypto');
const { User }  = require('../models/user');
const { sendResetMessage } = require('../Logic');
const express = require('express');
const router = express.Router();

  router.post('/', async (req, res) => {
    if(req.body.email == ''){
      return res.send('email required');
    }

    User.findOne({
        emailAddress:req.body.email
    }).then( async user => {
      if(user == null){
      // console.log('email not in db');
      return res.send('email not in db');
    }else {
      const token = crypto.randomBytes(20).toString('hex');
      // console.log(token);
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000
     const messageStatus = await sendResetMessage(token, user.mobileNumber);
       if(messageStatus.code == 200){
         await user.save();
        //  console.log(user);
          return res.send('Reset link sent Successfully to your registerd Mobile Number')
       }else{
         return res.send('Oops! Something went wrong, Please Try Again');
       }
     }
      
 });
});
module.exports = router;
