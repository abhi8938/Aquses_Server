//This router hanles request for new users
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _= require('lodash');
const { Employee, validate } = require('../models/employee')
const express = require('express');
const router = express.Router();


router.get('/me', auth,  async (req, res, next) => {
   const employee = await Employee.findById(req.Employee._id).select('-password');
   res.send(employee);
  });


router.post('/', async (req, res) => {
  let count;
     await Employee.estimatedDocumentCount({}, (error, size)=>{
    if(error) return res.status(400).send('customer id not generated please try again');
    count = size + 1; 
     return count;
   });
   const { error } = validate(req);
   if (error) return res.status(400).send(error.details[0].message);

   let employee = await Employee.findOne({ emailAddress: req.body.emailAddress });
   if(employee) return res.status(400).send('emailAddress already exist');

   employee = await Employee.findOne({ mobileNumber: req.body.mobileNumber });
   if(employee) return res.status(400).send('mobileNumber already exist');

   if(count == undefined) return res.status(400).send('Server Error, Please Try Again');
   employee = new Employee(addEmployee(req, count)); 

   const salt = await bcrypt.genSalt(10);
   employee.password = await bcrypt.hash(employee.password, salt);
   
   employee = await employee.save()
   .then(() =>{
    res.send(_.pick(employee, ['fullName', 'emailAddress']));
     })
   .catch(() =>{
    res.send('wrong');
   })
  
});

router.delete('/:id',  async (req,res)=>{
  const employee = await Employee.findByIdAndDelete(req.params.id);
   if(!employee) return res.status(404).send('the Employee with given id is not available');
   res.send(employee);
});



// create put route handler to update firstName, lastName, mobileNumber
router.put('/details', async (req, res) => {
  const employee = await Employee.findOne({ customerId: req.body.customerId});
  if(!employee) return;
  // const { error } = validateMobile(req);
  // if (error) return res.status(400).send(error.details[0].message);

   if(req.body.firstName !=''){
     const updatedFirstName = req.body.firstName;
     employee.firstName = updatedFirstName;
   }
   if(req.body.lastName !=''){
    const updatedLastName = req.body.lastName;
    employee.lastName = updatedLastName;
  }
  
  if(req.body.mobileNumber !=''){

    const updatedMobileNumber = req.body.mobileNumber;
    employee.mobileNumber = updatedMobileNumber;
  }
   await employee.save();
  res.send('Update Successfull');

});
// create put route handler to update password
router.put('/password', async (req, res) => {
  const employee = await Employee.findOne({ customerId: req.body.customerId});
  if(!employee) return res.status(404).json('no Employee exists in db to update');;
  
  const { error } = validatePassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  const validPassword = await bcrypt.compare(req.body.oldPassword, Employee.password);
  if(!validPassword) return res.status(400).send('Invalid Password');
  
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(req.body.newPassword, salt);
   await employee.save();
  res.send('Password Updated');
});

//create forgotPasswordReset handler
router.put('/resetPassword', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const employee = await Employee.findOne({ EmployeeName: req.body.EmployeeName});
  const { error } = validateResetPassword(req);
  if (error) return res.status(400).send(error.details[0].message);

  if(!employee) {
    return res.status(404).json('no Employee exists in db to update');
  }else if(employee){
    console.log('Employee exists');
    return bcrypt.hash(req.body.password, salt)
                      .then( newPassword => {
                         console.log(newPassword);
                         employee.password = newPassword;
                         employee.resetPasswordToken = null;
                         employee.resetPasswordExpires = null;
                      })
                      .then(async () =>{
                      await employee.save();
                       res.status(200).send({ message:'password updated'})
                      });
  }
});





function addEmployee(req, count){
  const addedEmployee={
    //TODO: handlepost request
    fullName:req.body.fullName,
    emailAddress: req.body.emailAddress,
    mobileNumber: req.body.mobileNumber, 
    password: req.body.password,
    employeeId:'EMP@00'+ count
  };
  return addedEmployee;
}


module.exports = router; 