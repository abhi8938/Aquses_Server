//This router hanles request for new users
const { Coupon, validate } = require('../models/coupon')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const coupons = await Coupon.find();
    res.send(coupons);
});

router.post('/', async (req, res) => {
    const { error } = validate(req);
    if (error) return res.status(400).send(error.details[0].message);
    let coupon = new Coupon(addCoupon(req));
    coupon = await coupon.save();
    res.send(coupon);
});

function addCoupon(req) {
    const addedService = {
        //TODO: handlepost request
        Code: req.body.Code,
        Discount:req.body.Discount
    };
    return addedService;
}


module.exports = router; 