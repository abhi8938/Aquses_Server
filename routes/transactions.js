// this routehandler handles request for participant collection
const auth = require('../middleWare/auth');
const { Transaction, validate} = require('../models/transaction');
const express = require('express');
const router = express.Router();
const {addPaymentMode} = require('../Logic');

router.get('/', auth,  async (req, res) => {
    const transactions = await Transaction.find({customerId:req.headers.customerid})
                                          .limit(10)
    res.send(transactions);
  });

  router.get('/count', auth, async (req, res) => {
    const transactions = await Transaction.estimatedDocumentCount();
    res.send(transactions.toString());
  });  

  router.post('/',auth,async (req, res) => {
    //Validate request body
 
    const validation = validate(req);
  
     if(validation.error){
         //400 bad request
         res.status(400).send(validation.error.details[0].message);   
     }
   let transactions = new Transaction(addTransaction(req));
     transactions = await transactions.save();

   if(transactions.TxnStatus == 'SUCCESS'){
     console.log(transactions);
     //TODO: AddPaymentMode in order
     if(transactions.TxnStatus == 'SUCCESS'){
       await addPaymentMode(transactions.TxnId, 'PAYTM', transactions.orderId)
     }
    
      res.status(200).send('Payment Successful');
   }else{
    res.status(400).send('Payment Failed, Please Retry');
   }
 });


function addTransaction(req){
    const addedTransaction={
          //TODO: handlepost request
          customerId: req.body.customerId,
          TxnId: req.body.TxnId,
          Amount: req.body.Amount,
          TxnStatus: req.body.TxnStatus,
          TxnDate: Date.now(),
          orderId: req.body.orderId

    }
    return addedTransaction;
}

module.exports = router;