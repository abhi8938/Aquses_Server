//This router hanles request for new users
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _ = require('lodash');
const { Order, validate } = require('../models/order');
const { Employee } = require('../models/employee');
const express = require('express');
const router = express.Router();
let generated = false;

router.get('/employees', async (req, res) => {
  var id = req.headers.employeeid;
  if (req.headers.type == 'ASSIGNED') {
    let Assigned = new Array
   
    var params = {};
    params.$where = 'function(){' +
      'if(this.Employee != undefined){' +
      'if(this.orderStatus == "PICKUP" || this.orderStatus == "DELIVER"){' +
      'return this' +
      '}' +
      '}' +
      '}';
    const orders = await Order.find(params).sort({ orderPlaced: -1 });

    orders.map(element => {
      if(element.Employee.PickUp.EmployeeId == id  && element.orderStatus == 'PICKUP'){
       return Assigned.push(element);
      }
      if(element.Employee.Delivery.EmployeeId == id && element.orderStatus == 'DELIVER'){
        return Assigned.push(element);
      }
      return
    })
// console.log(`assigned`, Assigned);
    res.status(200).send(Assigned)

  } else if (req.headers.type == 'COMPLETED') {
    let completed = new Array;
    var params = {};
    params.$where = 'function(){' +
      'if(this.Employee != undefined){' +
      'if(this.orderStatus == "COMPLETED"|| this.orderStatus == "PICKED"){' +
      'return this' +
      '}' +
      '}' +
      '}';
 
    const orders = await Order.find(params).sort({ orderPlaced: -1})
    console.log(`completed`, orders);
    orders.map(element => {
      if(element.Employee.PickUp.EmployeeId == id && element.orderStatus == 'PICKED'){
        return completed.push(element);
       }
       if(element.Employee.Delivery.EmployeeId == id && element.orderStatus == 'COMPLETED'){
        let present = false;
        completed.map(elem => {
            if(elem.orderId == element.orderId){
              present =true
              return
            }
           return present = false
         })
         if(present){
           return
         }
         return completed.push(element);
       }
       return
    })
   
    res.status(200).send(completed);
  }

})


router.get('/', async (req, res, next) => {
  const orders = await Order.find({ $where: function(){
    if(this.orderStatus != 'COMPLETED'){
      return this
    }
  }}).limit(20).sort({orderPlaced: -1});
  res.send(orders);

});

router.get('/customer', async (req, res) => {
  const orders = await Order.find({ customerId: req.headers.customerid }).sort({ orderPlaced: -1})
  res.send(orders).status(200);
});

router.post('/', async (req, res) => {
  let order;
  let Id;
  do {
    Id = generateOrderId();
    order = await Order.findOne({ orderId: Id });
    if (!order) generated = true;
  }
  while (generated == false);

  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);
  order = new Order(addOrder(req, Id));
  order = await order.save();
  res.send(order).status(200);
});

router.put('/', async (req, res) => {
  let order = await Order.findOne({ orderId: req.body.orderId });
  if (!order) return res.status(400).send('Not Found');
  if (req.body.orderStatus == 'PICKUP') {
    order.orderStatus = 'PICKED';
    order = await order.save();
    res.status(200).send('UPDATED');
  } else if (req.body.orderStatus = 'DELIVER') {
    order.orderStatus = 'COMPLETED';
    order.delivery = Date.now();
    order = await order.save();
    res.status(200).send('UPDATED');
  }

});



router.put('/employee', async (req, res) => {

  const employee = await Employee.findOne({ fullName: req.body.name });
  if (!employee) return res.status(400).send('Employee Not Found')
  let order = await Order.findOne({ orderId: req.body.orderId });
  if (!order) return res.status(400).send('Order Not Found');
  // add employee details to db
  if (req.body.job == 'PICKUP') {
    order.Employee.PickUp.EmployeeId = employee.employeeId;
    order.Employee.PickUp.EmployeeName = employee.fullName;
    order.Employee.PickUp.EmployeeContact = employee.mobileNumber;
    order.orderStatus = 'PICKUP';
    order = await order.save();
    res.status(200).send('UPDATED');
  } else if (req.body.job == 'DELIVER') {
    if(order.Employee != undefined || order.Employee.PickUp != undefined){
      if(order.orderStatus == 'PICKED'){
    order.Employee.Delivery.EmployeeId = employee.employeeId;
    order.Employee.Delivery.EmployeeName = employee.fullName;
    order.Employee.Delivery.EmployeeContact = employee.mobileNumber;
    order.orderStatus = 'DELIVER';
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    order.delivery = tomorrow;
    order = await order.save();
   return res.status(200).send('UPDATED');
  }else{
   return res.status(400).send('Order Not Picked'); 
  }
  }else{
   return res.status(400).send('Please Assign PickUp Employee first');
  }
  }
  // console.log(order);
});

function generateOrderId() {
  return Math.random().toString(36).substr(2, 9);
}


function addOrder(req, orderId) {
  const payment = {
    paid: req.body.paid,
    paymentMode: req.body.mode,
    transactionId: req.body.transactionId
  };
  const addedOrder = {
    orderId: orderId,
    serviceType: req.body.serviceType,
    expectedDelivery: req.body.expectedDelivery,
    pickUp: req.body.pickUp,
    orderAddress: req.body.orderAddress,
    clothesItem: req.body.clothesItem,
    customerId: req.body.customerId,
    payment: payment,
    finalAmount: req.body.finalAmount
  };
  return addedOrder;
}

module.exports = router; 