const express = require('express');
const bp = require('body-parser');
const request = require('request');
const https= require('https');
const app = express();
app.use(bp.urlencoded({extended:true}));
app.use(express.static('public'));
app.get('/', function(req, res){
	res.sendFile(__dirname+'/newsletter.html');
});

app.post('/', function(req, res){
	const email = req.body.email;
	const fname = req.body.fname;
	const lname = req.body.lname;
	const postUrl = "https://us14.api.mailchimp.com/3.0/lists/90a702cd7d";
	const inputs = {
  "members": [
    {
      "email_address": email,
      "merge_fields": {
        "FNAME": fname,
        "LNAME": lname
      },
      "status":"subscribed"
    }
  ]
};
	const jsonData = JSON.stringify(inputs);
	console.log(jsonData);
	const options = {
		method:"post",
		auth:"abdul:eb6401f9acbe9a800750692ad7692795-us14"
	};
   	const request = https.request(postUrl, options, function(response){
		if(response.statusCode===200){
			res.sendFile(__dirname+'/success.html');
		}else{
			res.sendFile(__dirname+'/failed.html');
		}

		response.on('data', function(data){
		    const pd = JSON.parse(data);
			console.log(pd);
		});
	});
	request.write(jsonData);
	request.end();
});

app.get('/failed', function(req, res){
	res.redirect('/');
});
app.listen(3000, function(){
	console.log('connecting to port 3000!');
});
