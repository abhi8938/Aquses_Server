// this model contains schema and for single match document
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const rzptransactionSchema = new mongoose.Schema({
    RAZORPAY_ID:{
        type:String  
    },
    customer_Id:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    receipt:{
        type:String,
        required:true
    },
    payment_capture:{
        type:Boolean,
        required:true
    },
    status:{
        type:String
    },
    attempt:{
        type:Number
    },
    notes:{
     type:String
    },
    customerEmailId:{
        type:String,
        required:true
    },
    customerMobile:{
          type:String,
          required:true
    },
    razorpay_payment_id:{
        type:String,
    },
    created_at:{
        type:Number
    },
    orderId:{
         type:String,
         required:true
    }

});

//create model/class which takes argument matchSchema and collection in which it should be updated

const Transaction = mongoose.model('RZPTransactions', rzptransactionSchema);

function validateTransaction(req){
    const schema = {
        RAZORPAY_ID: Joi.string(),
        customer_Id: Joi.string().required(),
        amount: Joi.number().max(300000).required(),
        currency: Joi.string(),
        receipt: Joi.string(),
        payment_capture: Joi.string(),
        status: Joi.string(),
        attempt: Joi.string(),
        notes: Joi.string(),
        customerEmailId: Joi.string().required(),
        customerMobile: Joi.string().min(10).required(),
        created_at: Joi.number(),
        razorpay_payment_id: Joi.string(),
        orderId: Joi.string().required()
    };

    return Joi.validate(req.body, schema);
     
}

exports.RZPTransaction= Transaction;
exports.validate = validateTransaction;