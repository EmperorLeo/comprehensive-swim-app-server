var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
// 	var db = req.db;
// 	var collection = db.get('users');
// 	collection.find({},{}, function(e, docs) {
// 		res.json(docs);
// 	});
	User.find(function(err, users) {
		if(users) {
			res.json(users);
		} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("Could not retrieve users");
		}
	
	});
});

router.get('/username/:username', function(req, res, next) {
	User.findOne({userName: req.params.username}, function(err, user) {
	
		if(user) {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(user));
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("User not found");
		}

	
	});	

});


/* This should post a user on user creation */
router.post('/', function(req, res, next) {
	
	var user = new User();
	
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.userName = req.body.userName;
	user.birthday = req.body.birthday;
	user.email = req.body.email;
	
	var salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(req.body.password, salt);
	
	user.clubs = [];
	user.meets = [];
	user.goals = [];
	user.sets = [];
	user.times = [];
	
	user.save(function(err) {
		
		if(err) {
			res.writeHead(400, {"Content-Type": "application/json"});
			res.end(JSON.stringify({"created": false}));
		} else {
			res.writeHead(201, {"Content-Type": "application/json"});
			var json = JSON.stringify({"created":true});
			res.end(json);
		}

	
	});

});

router.post('/auth', function(req, res, next) {

	var userName = req.body.userName;
	var password = req.body.password;
		
	User.findOne({"userName": userName}, function(e, docs) {
		
		var user = docs;
		
		if(user) {
		
			console.log(user);
		
			var match = bcrypt.compareSync(password, user.password);
		
			console.log(match);
		
			if(match) {
				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify({"authorized":true, "token":"NOT_IMPLEMENTED"}));
			} else {
				res.writeHead(403, {"Content-Type": "application/json"});
				res.end(JSON.stringify({"authorized":false}));
			}
		
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.end("User not found.");
		}

	
	});	
	
});

module.exports = router;
