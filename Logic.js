const CryptoJS = require("crypto-js");
const { Order } = require('./models/order');
//START

async function addPaymentMode(transactionId, mode, orderID){
console.log(transactionId, mode, orderID);
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
    const success = 'Payment is Successful';
    const fail = 'Payment Failed';
    const customer_Id = request.body.customer_Id;
    const amount = request.body.amount;
if(generated_signature == razorpay_signature){
   //TODO Notify customer payment is successful and update payment in order
 const order = await addPaymentMode(razorpay_order_id, 'NETBANKING/CARD', request.body.orderId);
 console.log(order);
    return success;
}else{
   return fail;
}}

//THE END

exports.authorizePayment = authorizePayment;
exports.addPaymentMode = addPaymentMode;