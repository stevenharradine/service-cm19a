var http = require('http');
var default_port = 1771;
var util = require('util')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { util.puts(stdout) }

http.createServer(function (req, res) {
	var urlSplitOnSegment = req.url.split('?')[1];

	if (urlSplitOnSegment != undefined) {
		var urlSplit = urlSplitOnSegment.split('&');

		if (urlSplit != undefined) {
			var output     = "",
			    houseCode  = "",
			    unitCode   = "",
			    statusCode = "",
			    command    = "",
			    validHouseCodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'],
			    validUnitCodes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
			    validStatusCodes = ['-', '+'];

			for (i = 0; i < urlSplit.length; i++) {
				var name  = urlSplit[i].split('=')[0],
				    value = urlSplit[i].split('=')[1];

				if (name == "houseCode") {
					houseCode = value;
				} else if (name == "unitCode") {
					unitCode = value;
				} else if (name == "statusCode") {
					statusCode = value;
				}
			}

			if ((validHouseCodes.indexOf(houseCode) >= 0 ) &&
				(validUnitCodes.indexOf(unitCode) >= 0) &&
				(validStatusCodes.indexOf(statusCode) >= 0)
			) {
				res.writeHead ("200", {'Content-Type': 'text/plain'});
				res.end (
					exec("echo " + statusCode + houseCode + unitCode + " > /home/pi/pycm19a/cm19a/in", puts).toString()
				);
			}

			res.writeHead ("300", {'Content-Type': 'text/plain'});
			res.end ("Error: invalid code(s)");
		} else {
			res.writeHead ("500", {'Content-Type': 'text/plain'});
			res.end ("Error");
		}
	} else {
		var output = "no params passes";
		res.writeHead ("500", {'Content-Type': 'text/plain'});

		console.log (output);
		res.end (output);
	}
}).listen(default_port);