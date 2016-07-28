var fs = require('fs');
var express = require('express');
var uid = require('uid');
var app = express();
var bodyParser = require('body-parser');
var webshot = require('url-to-screenshot');
var config = require('./config');

console.log(config)
app.use(bodyParser.json());

app.post('/generate', function(req, res){
	var text = "var chart= c3.generate("+JSON.stringify(req.body)+")</script>\n</html>";
	shrtUrl = uid(10)+".html";
	fs.createReadStream('template.html').pipe(fs.createWriteStream(shrtUrl)).on('finish', function(){
	fs.appendFile(shrtUrl, text, function(err){
		console.log(text);
		if(err) {
			res.status(500).send({status:'Internal Error', message:'', error:err});
			throw err;
		}
		else {
			webshot(config.PATH + shrtUrl,{timeout: config.TIMEOUT}).capture(function(err, img){
				fs.writeFile(shrtUrl.replace("html","png"), img, function(err){
					if(!err)
						res.status(200).send({status:'success', url:config.URL + shrtUrl.replace("html","png")});
					else
						res.status(500).send({status:'Internal Error', message:'', error:err});
				})
			})
		}
	   })
	})
})

app.listen(config.PORT);
console.log("Graphlar: running\n[Listening]",config.PORT);
