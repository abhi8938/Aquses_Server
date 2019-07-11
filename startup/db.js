const mongoose = require('mongoose');
const startupDebugger = require('debug')('app:startup');
module.exports = function () {

mongoose.connect('mongodb://localhost/Aquses')
        .then(() => console.log('connected to mongodb'))
        .catch(err=> startupDebugger('could not connect',err))
}