const express = require('express')
, redirect = require("express-redirect");
const bodyParser = require('body-parser');
const engines = require('consolidate');
const cors = require('cors');
const app = express();
redirect(app); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine("ejs", engines.ejs);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})); 

// if(app.get('env') === 'development'){
// app.use(morgan('tiny'));
// startupDebugger('morgan enabled');
// }


require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/prod')(app);

const port = process.env.PORT || 3002;
app.listen(port,() => console.log('Listening '+ port));