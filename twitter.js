/* Restreaming Data from the Twitter-Streaming API */

var https = require('https'),
	http = require('http'),
	util = require('util'),
	url = require('url');

var trackstring = "track=test";

var options = {
	host : 'stream.twitter.com',
	port : 443,
	path : '/1/statuses/filter.json',
	auth : process.argv[2] + ":" + process.argv[3],
	headers : {
		'Content-Type' : 'application/x-www-form-urlencoded'
	},
	method : 'POST',
}

var responses = [];

var req = https.request(options, function(res) {

	util.puts("Opening Stream with StatusCode: ", res.statusCode);
	util.puts(JSON.stringify(res.headers));
	res.on('data', function(dat) {
		
		try{
			if(/^\{/.test(dat)) {
				var tweet = JSON.parse(dat);
				if(tweet.user) {
					pushStr(' ');
					pushStr(tweet.user.screen_name);
					pushStr(tweet.text);
				}
			}
		} catch (err) {
			util.puts('Catch me if u can');
			util.puts(dat);
		}
	});

});

req.write(trackstring);
req.end();

var srv = http.createServer(function(clientreq, res) {
	responses.push(res);
	res.writeHead(200, {'Content-Type' : 'text/plain'});

	query = url.parse(clientreq.url).query;
});


function pushStr(dat) {
	responses.forEach(function(res) {
		res.write(dat);
		res.write('\n');
	});
}

srv.listen(8080);

req.on('error', function(e) {
	util.puts(e);
});

