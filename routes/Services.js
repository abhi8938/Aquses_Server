//This router hanles request for new users
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _= require('lodash');
const { Service, validate } = require('../models/service')
const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
    const services = await Service.find();
    res.send(services);

  });

router.post('/',  async (req, res) => {
 
 //Generate ServiceID unique   
const {error} = validate(req);
if (error) return res.status(400).send(error.details[0].message);
let service= new Service(addService(req));

 service = await service.save();
res.send(service);
});




// create put route handler to update firstName, lastName, mobileNumber
router.put('/', async (req, res) => {
 

});
// create put route handler to update password





function addService(req){
  const addedService={
    //TODO: handlepost request
    serviceId: '#11111',
    serviceName: req.body.serviceName,
    servicePrice: req.body.servicePrice,
    industryType: req.body.industryType
  
  };
  return addedService;
}


module.exports = router; 