//This router hanles request for new users
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _= require('lodash');
const { User, validate } = require('../models/user')
const express = require('express');
const router = express.Router();


router.get('/me', auth,  async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password'); 
   res.send(user);
  
  });


router.post('/', async (req, res) => {
  let count;
     await User.estimatedDocumentCount({}, (error, size)=>{
    if(error) return res.status(400).send('customer id not generated please try again');
    count = size + 1; 
     return count;
   });
   const { error } = validate(req);
   if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ emailAddress: req.body.emailAddress });
   if(user) return res.status(400).send('emailAddress already exist');

   user = await User.findOne({ mobileNumber: req.body.mobileNumber });
   if(user) return res.status(400).send('mobileNumber already exist');

   if(count == undefined) return res.status(400).send('Server Error, Plese Try Again');
   user = new User(adduser(req, count)); 

   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(user.password, salt);
   
   user = await user.save()
   .then(() =>{
    res.send(_.pick(user, ['fullName', 'emailAddress']));
     })
   .catch(() =>{
    res.send('wrong');
   })
  
});

router.delete('/:id',  async (req,res)=>{
  const user = await user.findByIdAndDelete(req.params.id);
   if(!user) return res.status(404).send('the user with given id is not available');
   res.send(user);
});



// create put route handler to update firstName, lastName, mobileNumber
router.put('/details', async (req, res) => {
  const user = await User.findOne({ customerId: req.body.customerId});
  if(!user) return;
  // const { error } = validateMobile(req);
  // if (error) return res.status(400).send(error.details[0].message);

   if(req.body.firstName !=''){
     const updatedFirstName = req.body.firstName;
     user.firstName = updatedFirstName;
   }
   if(req.body.lastName !=''){
    const updatedLastName = req.body.lastName;
    user.lastName = updatedLastName;
  }
  
  if(req.body.mobileNumber !=''){

    const updatedMobileNumber = req.body.mobileNumber;
    user.mobileNumber = updatedMobileNumber;
  }
   await user.save();
  res.send('Update Successfull');

});
// create put route handler to update password
router.put('/password', async (req, res) => {
  const user = await User.findOne({ customerId: req.body.customerId});
  if(!user) return res.status(404).json('no user exists in db to update');;
  
  const { error } = validatePassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
  if(!validPassword) return res.status(400).send('Invalid Password');
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.newPassword, salt);
   await user.save();
  res.send('Password Updated');
});

//create forgotPasswordReset handler
router.put('/resetPassword', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const user = await User.findOne({ userName: req.body.userName});
  const { error } = validateResetPassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  if(!user) {
    return res.status(404).json('no user exists in db to update');
  }else if(user){
    console.log('user exists');
    return bcrypt.hash(req.body.password, salt)
                      .then( newPassword => {
                         console.log(newPassword);
                         user.password = newPassword;
                         user.resetPasswordToken = null;
                         user.resetPasswordExpires = null;
                      })
                      .then(async () =>{
                      await user.save();
                       res.status(200).send({ message:'password updated'})
                      });
  }
});





function adduser(req, count){
  const addeduser={
    //TODO: handlepost request
    fullName:req.body.fullName,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber, 
    password: req.body.password,
    customerId:'CUST@00'+ count
  };
  return addeduser;
}


module.exports = router; 