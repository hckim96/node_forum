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
    // '0.0.0.0' to use IPv4
    http.listen(PORT, '0.0.0.0', function() {
        var httpx = require('http');
        httpx.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
            console.log("My public IP address is: " + ip);
            });
        });
        console.log('listening on *:' + PORT);
    });
}

start_server();


module.exports = {
    http,
    db,
}
