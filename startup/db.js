const mongoose = require('mongoose');
const startupDebugger = require('debug')('app:startup');
module.exports = function () {
        mongoose.connect('mongodb+srv://abhishek8938:gotranks@cluster0-scnj3.mongodb.net/test?retryWrites=true')
        .then(() => console.log('connected to mongodb'))
        .catch(err=> console.log('could not connect',err))
        
// mongoose.connect('mongodb://localhost/Aquses')
//         .then(() => console.log('connected to mongodb'))
//         .catch(err=> console.log('could not connect',err))
}