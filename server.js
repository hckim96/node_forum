const { app } = require("./app");
const mongoose = require("mongoose");

var http = require('http').Server(app);
var db;
require('dotenv').config();
const {PORT, MONGO_URI} = process.env;

function start_server() {    
    
    db         = mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        ssl: true,
        sslValidate: false,
    });
    
    http.listen(PORT, function() {
        console.log('listening on *:' + PORT);
    });
}

start_server();


module.exports = {
    http,
    db,
}
