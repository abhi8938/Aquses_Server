  //This router hanles request for new users
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _= require('lodash');
const { Order, validate } = require('../models/order');
const {Employee} = require('../models/employee');
const express = require('express');
const router = express.Router();




router.get('/', async (req, res, next) => {
    const orders = await Order.find();
    res.send(orders);

  });

router.get('/customer',async (req,res) => {
const orders = await Order.find({ customerId:req.headers.customerid})
 res.send(orders);
});

router.post('/',  async (req, res) => {
  const { error } = validate(req);
   if (error) return res.status(400).send(error.details[0].message);
   let order = new Order(addOrder(req));
   order = await order.save();
   res.send(order);
});

router.put('/', async (req,res) => {
console.log(req.body);
let order = await Order.findOne({orderId:req.body.orderId});
if(!order) return res.status(400).send('Not Found');
if(req.body.orderStatus == 'PICK UP'){
  order.orderStatus = 'PICKED';
  order = await order.save();
  res.status(200).send('UPDATED');
}else if( req.body.orderStatus = 'DELIVER'){
  order.orderStatus = 'COMPLETED';
  order.deliver.deliverTime = Date.now();
  order = await order.save();
  res.status(200).send('UPDATED');
}

});



router.put('/employee', async (req, res) => {
 // req.body = employeeName, job type, orderId
 // find employee Document with employeeName

 const employee = await Employee.findOne({ fullName:req.body.name});
 if(!employee)return res.status(400).send('Employee Not Found')
let order = await Order.findOne({ orderId: req.body.orderId});
if(!order) return res.status(400).send('Order Not Found');
 // add employee details to db
 if(req.body.job == 'PICKUP'){
order.Employee.PickUp.EmployeeId = employee.employeeId;
order.Employee.PickUp.EmployeeName = employee.fullName;
order.Employee.PickUp.EmployeeContact = employee.mobileNumber;
order.orderStatus = 'PICK UP';
order = await order.save();
}else if(req.body.job == 'DELIVER'){
  order.Employee.Delivery.EmployeeId = employee.employeeId;
order.Employee.Delivery.EmployeeName = employee.fullName;
order.Employee.Delivery.EmployeeContact = employee.mobileNumber;
order.orderStatus = 'DELIVER';
order = await order.save();
}
// console.log(order);
res.send(order);
});

router.put('/amount', async (req, res) => {
  // req.body = FinalAmount, Total Weight, orderId, 
  // console.log(req.body);
  // find Order document
  let order = await Order.findOne({ orderId:req.body.orderId});
  if(!order) return res.status(400).send('Order Not Found');
  // add Amount details to db
  order.finalAmount = req.body.amount;
  order.orderWeight = req.body.weight;
  order.orderStatus = 'BILLED'
  order = await order.save();
  res.status(200).send('Updated');
 
 });




function addOrder(req){
  const addedOrder={
    orderId: req.body.orderId,
    serviceType: req.body.serviceType,
    expectedDelivery: req.body.expectedDelivery,
    pickUp:req.body.pickUp,
    orderAddress:req.body.orderAddress,
    clothesItem:req.body.clothesItem,
    customerId: req.body.customerId, 
  };
  return addedOrder;
}

module.exports = router; 