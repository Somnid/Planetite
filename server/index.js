var server = require("./server");
var router = require("./router");
var port = 1337;

server.start(port, router);