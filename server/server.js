var http = require('http');
var url = require('url');

function start(port, router){
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		
		router.route(pathname, response);
	}
	http.createServer(onRequest).listen(port, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:' + port + '/');
}

exports.start = start;
