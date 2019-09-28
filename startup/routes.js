// const error = require('../middleWare/error');
const express = require('express');
const users = require('../routes/Users');
const auth = require('../routes/Auth');
const orders = require('../routes/Orders');
const services = require('../routes/Services');
const rzptransactions = require('../routes/RzpTransactions');
const employees = require('../routes/Employees');
const transactions = require('../routes/transactions');
const paytm = require('../app/routes/paytm.routes');
const resetToken = require('../routes/resetToken');
const resetPassword = require('../routes/resetPassword');
const coupon = require('../routes/Coupons')
module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/orders',orders);
    app.use('/api/services', services);
    app.use('/api/rzptransactions', rzptransactions);
    app.use('/api/employees', employees);
    app.use('/api/transactions', transactions);
    app.use('/api/paytm', paytm);
    app.use('/api/reset', resetToken);
    app.use('/api/resetPassword',resetPassword);
    app.use('/api/coupons',coupon);
}