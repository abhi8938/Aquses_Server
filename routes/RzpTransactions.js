// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const Razorpay = require('razorpay');
const { RZPTransaction, validate} = require('../models/rzptransaction');
const express = require('express');
const router = express.Router();
const { authorizePayment } = require('../Logic');
let rzp = new Razorpay({
  key_id: 'rzp_test_PqxUlQVTCDEAic', // your `KEY_ID`
  key_secret:'CocvsEaZrHz8VrqXjmHTlsC6' // your `KEY_SECRET`
});
router.get('/', async (req, res) => {
    const transactions = await RZPTransaction.find();
    res.send(transactions);
  });

 
  router.post('/', async (req, res) => {
    let count;
   await RZPTransaction.collection.countDocuments({}, (error, size)=>{
    if(error) return res.status(404).send('Something went wrong!');
    count = size + 1; 
     return count;
   });
   //Validate request body
   const validation = validate(req);
   //  console.log(validation.error.details[0].message);
    if(validation.error){
        //400 bad request
        res.status(400).send(validation.error.details[0].message);   
    }
    let rzptransactions = await RZPTransaction.find();
    const rzpTransaction = await createTransaction(req,count);
   rzptransactions = new RZPTransaction(addTransaction(req, rzpTransaction));
  
    rzptransactions = await rzptransactions.save();
    console.log('rzptransactions:' + rzptransactions);
    res.send(rzptransactions);
 });

//create route to handle put request for razorpay_payment_id

router.put('/', auth, async (req, res) => {
  //add   razorpay_payment_id in database
const rzptransaction = await RZPTransaction.findOne({ RAZORPAY_ID: req.body.razorpay_order_id})
if(!rzptransaction) return res.status(400).send('Oops Something went wrong!..Try Again ');

rzptransaction.razorpay_payment_id = req.body.razorpay_payment_id
await rzptransaction.save();

//Call function AuthorizePayment to capture payment
const paymentresult = await authorizePayment(req);
res.send(paymentresult);

})

 function addTransaction(req, order){
  const amount = order.amount/100
 const addedOrder={
        //TODO: handlepos request
        RAZORPAY_ID: order.id,
        customer_Id: req.body.customer_Id,
        amount: amount,
        currency: 'INR',
        receipt: order.receipt,   //CREATE RANDOM RECEIPT STRING
        payment_capture: true,
        status: order.status,
        attempt: order.attempt,
        notes: 'Payment Test 1', 
        customerEmailId: req.body.customerEmailId,
        customerMobile: req.body.customerMobile,
        created_at:order.created_at,
        orderId:req.body.orderId
  }
  return addedOrder;
}

async function createTransaction(req, count){

  const amount= req.body.amount;
  const currency= 'INR';
  const receipt= 'RECEIPT#' + count;
  const payment_capture = true;
  const notes='Payment Test 3'; 

  return rzp.orders.create({
   amount,
   currency,
   receipt,
   payment_capture,
   notes

  }).then((data) => {
    return data;
  }).catch((err) => {
    return err;
  }); 
}
module.exports = router;