const CryptoJS = require("crypto-js");
const { Order } = require('./models/order');
const unirest = require('unirest');


//START
async function sendResetMessage(token, clientNumber){
   const resetMessage = `Click the link to reset your Laundry Guru App Password:\n https://www.aquses.com/admin/#/reset/?token=${token}`;
   var req = unirest("GET", "https://www.txtguru.in/imobile/api.php");

   req.headers({
       "cache-control": "no-cache",
     });
   
   req.query({
       "username": 'sachin.patel036' ,
       "password": "69120784",
       "source": 'LANGRU',
       "dmobile": `91${clientNumber}`,
       "message":resetMessage
     });

 
 
 req.end(function (res) {
   if(res.body.return == true){
       return res.body.message
   }else{
       return res.body.message
   }
 });
 return req;

}
//END

//START

async function addPaymentMode(transactionId, mode, orderID){
const order = await Order.findOne({ orderId: orderID});
if(!order) return 'Notfound';
order.payment.paid = true;
order.payment.paymentMode = mode;
order.payment.transactionId = transactionId;
return order;
}
//THE END

//RAZORPAY
async function authorizePayment(request){
    const razorpay_signature = request.body.razorpay_signature;
    const razorpay_payment_id = request.body.razorpay_payment_id;
    const razorpay_order_id = request.body.razorpay_order_id;
    const key_secret = 'CocvsEaZrHz8VrqXjmHTlsC6';  
    const generated_signature = CryptoJS.HmacSHA256(razorpay_order_id + '|' + razorpay_payment_id,key_secret);
    const success = 'SUCCESS';
    const fail = 'FAILED';
if(generated_signature == razorpay_signature){
   //TODO Notify customer payment is successful and update payment in orde
    return success;
}else{
   return fail;
}}

//THE END

exports.authorizePayment = authorizePayment;
exports.addPaymentMode = addPaymentMode;
exports.sendResetMessage = sendResetMessage;