var express = require('express');
var mongoose = require('mongoose');

var app = express();
const PORT = process.env.PORT || 3000;

// Db connection 
mongoose.connect("mongodb://localhost:27017/apiTest")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(require('./routes'))

app.listen(PORT, () => 
    console.log(`The application is running on port ${PORT}`)
);