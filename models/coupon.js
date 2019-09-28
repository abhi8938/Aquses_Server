// this model contains schema and for single registered user
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const couponSchema = new mongoose.Schema({     
   Code:{
       type:String,
       required:true
   },
   Discount:{
       type:Number,
       required:true
   }
});

//create model/class which takes argument Schema and collection in which it should be updated

const Coupon = mongoose.model('Coupon', couponSchema);

function validateCoupon(req){
    const schema = {
      Code:Joi.string().required(),
      Discount:Joi.number().required()
    };

    return Joi.validate(req.body, schema);
     
}


exports.Coupon = Coupon;
exports.validate = validateCoupon;
