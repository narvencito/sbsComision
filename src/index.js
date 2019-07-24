'use strict'
const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 5000);
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit:'10mb'}));

app.use('/comision', require('./controllers/comisionController'));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(app.get("port"), () =>{
    console.log("server run in port "+ app.get('port'));
    
    })



