// this model contains schema and for single registered order
const Joi = require('joi');
const mongoose = require('mongoose');
//create ClothesListItem Schema
const clothesListSchema = new mongoose.Schema({
    Id:{
        type:String,
     },
   Category:{
    type:String,
    },    
   Item:{
    type:String,
   },
   Quantity:{
    type:Number,
  }
})


//create schema/blueprint for the document
const orderSchema = new mongoose.Schema({
       
     orderId:{
         type:String,
         required:true,
         unique:true
     },
     serviceType:{
         type:String,
         required:true
     },
     orderPlaced:{
         type:Date,
         default:Date.now()
     },
     expectedDelivery:{
         type:String,
         required:true
     },
     pickUp:{
         pickupTime:{type:String, required:true},
         pickupDate:{type:String, required:true},
     },
     delivery:{
         type:Date
     },
     orderAddress:{
         formatedAddress:{type:String, required:true},
         houseFloor:{type: String, required:true},
         latitude:{type:String, required:true},
         longitude:{type:String, required:true}
     },
     clothesItem:[clothesListSchema],
     customerId:{
         type:String,
         required:true
     },
     orderStatus:{
         type:String,
         enum:['CREATED', 'PICKUP', 'PICKED', 'DELIVER', 'COMPLETED'],
         default:'CREATED'
     },
     Employee:{
         PickUp:{
             EmployeeId:{ type:String},
             EmployeeName:{type:String},
             EmployeeContact:{type:String}
         },
         Delivery:{
            EmployeeId:{ type:String},
            EmployeeName:{type:String},
            EmployeeContact:{type:String}
         }
     },
     finalAmount:{
         type:Number,
     },
     orderWeight:{
         type:Number
     },
     payment:{
         paid:{
             type:Boolean,
             default:false
         },
         paymentMode:{
             type:String,
             enum:['COD','NETBANKING/CARD','PAYTM']
         },
         transactionId:{
             type:String
         }
     },
     customer:{
         fullName:{type:String, required:true},
         mobileNumber:{type:String, required:true}
     }
   
});


//create model/class which takes argument Schema and collection in which it should be updated

const Order = mongoose.model('Orders', orderSchema);

function validateorder(req){
    const schema = {
        orderId: Joi.string(),
        serviceType: Joi.string().required(),
        orderPlaced: Joi.date(),
        expectedDelivery: Joi.string().required(),
        pickUp: Joi.object().required(),
        orderAddress: Joi.object().required(),
        clothesItem: Joi.array(),
        customerId: Joi.string().required(),
        orderStatus:Joi.string(),
        Employee:Joi.object(),
        delivery: Joi.date(),
        finalAmount:Joi.number(),
        orderWeight:Joi.number(),
        payment:Joi.object(),
        transactionId:Joi.string(),
        mode:Joi.string(),
        paid:Joi.boolean(),
        customer:Joi.object()
    };

    return Joi.validate(req.body, schema);
     
}


exports.Order = Order;
exports.validate = validateorder;
