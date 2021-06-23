// this model contains schema and for single registered order
const Joi = require('joi');
const mongoose = require('mongoose');

//create schema/blueprint for the document
const servceSchema = new mongoose.Schema({
       
     serviceId:{
         type:String,
         required:true
     },
    serviceName:{
        type:String,
        required:true
    },
    servicePrice:{
        type:Number,
        required:true
    },
    industryType:{
        type:String,
        required:true
    }
   
});


//create model/class which takes argument Schema and collection in which it should be updated

const Service = mongoose.model('Services', servceSchema);

function validateService(req){
    const schema = {
        serviceId: Joi.string(),
        serviceName: Joi.string().required(),
        servicePrice: Joi.number().required(),
        industryType: Joi.string().required()
    };

    return Joi.validate(req.body, schema);
     
}


exports.Service = Service;
exports.validate = validateService;
