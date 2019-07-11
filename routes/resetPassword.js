// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const crypto = require('crypto');
const { Client }  = require('../models/client');
const { sendResetMessage } = require('../methods');
const express = require('express');
const router = express.Router();

  router.post('/', async (req, res) => {
    if(req.body.email == ''){
      return res.send('email required');
    }

    Client.findOne({
        emailAddress:req.body.email
    }).then( async client => {
      if(client == null){
      // console.log('email not in db');
      return res.send('email not in db');
    }else {
      const token = crypto.randomBytes(20).toString('hex');
      // console.log(token);
      client.resetPasswordToken = token;
      client.resetPasswordExpires = Date.now() + 360000
     const messageStatus = await sendResetMessage(token, client.mobileNumber);
       if(messageStatus.code == 200){
         await client.save();
        //  console.log(client);
          return res.send('Reset link sent Successfully to your registerd Mobile Number')
       }else{
         return res.send('Oops! Something went wrong, Please Try Again');
       }
     }
      
 });
});
module.exports = router;
