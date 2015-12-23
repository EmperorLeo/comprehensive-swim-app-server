var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var web_token = require('jsonwebtoken');
var tokenFunc = require('../jwtdecrypt.js');
var config = require('../config.js');

var notFound = function(response) {

	response.writeHead(404, {"Content-Type": "application/json"});
	response.end(JSON.stringify({"success": false, "reason": "User not found."}));

}

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

// 			console.log(user);

			var match = bcrypt.compareSync(password, user.password);

// 			console.log(match);

			if(match) {
				res.writeHead(200, {"Content-Type": "application/json"});


				var token = web_token.sign(user, config.secret, {
					expiresIn: "7d"
				});


				res.end(JSON.stringify({"authorized":true, "token":token}));
			} else {
				res.writeHead(403, {"Content-Type": "application/json"});
				res.end(JSON.stringify({"authorized":false}));
			}

		} else {
			notFound(res);
			// res.writeHead(404, {"Content-Type": "text/plain"});
			// res.end("User not found.");
		}


	});

});

router.use(tokenFunc);

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
			notFound(res);
			// res.writeHead(404, {"Content-Type": "text/plain"});
			// res.end("User not found");
		}


	});

});

router.delete('/username/:username', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			User.remove(user, function(error) {
				res.statusCode = 204;
				res.end();
			});

		} else {
			notFound(res);
			// res.writeHead(404, {"Content-Type": "text/plain"});
			// res.end("User not found");
		}

	});

});

router.post('/:username/clubs', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {


			user.clubs.push({organization: req.body.organization, color: req.body.color});
			user.save(function(err) {

				if(err) {
					res.writeHead(400, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": false, "reason": "You dun screwed up.  This organization already exists."}));

				} else {
					res.writeHead(200, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": true}));
				}
			});


		} else {
			notFound(res);
			// res.writeHead(404, {"Content-Type": "application/json"});
			// res.end(JSON.stringify({"success": false, "reason": "User not found."}));
		}

	});



});

/* Clears all clubs */
router.delete('/:username/clubs', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			user.clubs = [];
			user.save(function(err) {

				res.statusCode = 204;
				res.end();

			});

		} else {
			notFound(res);
		}
	});


});

router.post('/:username/meets', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			user.meets.push({meetId: req.body.meetId, date: req.body.date, name: req.body.name, permission: req.body.permission});
			user.save(function(err) {

				if(err) {
					res.writeHead(400, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": false, "reason": "Duplicate meet"}));
				} else {
					res.writeHead(201, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": true}));
				}

			});

		} else {
			notFound(res);
		}

	});

});

router.delete('/:username/meets', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			user.meets = [];
			user.save(function(err) {

				res.statusCode = 204;
				res.end();

			});

		} else {
			notFound(res);
		}

	});

});

router.post('/:username/goals', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {
			user.goals.push({
				meetId: req.body.meetId,
				event: req.body.event,
				goalType: req.body.goalType,
				goal: req.body.goal,
			});
			user.save(function(err) {

				if(err) {
					res.writeHead(400, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": false, "reason": "Duplicate goal"}));
				} else {
					res.writeHead(201, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": true}));
				}

			});
		} else {
			notFound(res);
		}

	});

});

router.delete('/:username/goals', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			user.goals = [];
			user.save(function(err) {

				res.statusCode = 204;
				res.end();

			});

		} else {
			notFound(res);
		}

	});

});

router.post('/:username/times', function(req, res, next) {

	var performance = {
		date: req.body.date,
		organizationId: req.body.organizationId,
		standard: req.body.standard,
		time: req.body.time
	}

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {
			var times = user.times;
			var eventName = req.body.event;
			var index = -1;
			for(var i = 0; i < times.length; i++) {
				if(times[i].event == eventName) {
					index = i;
					break;
				}
			}
			if(index == -1) {
					times.push({
						event: eventName,
						performances: [performance]
					});
			} else {
				times[index].performances.push(performance);
			}
			user.save(function(err) {
				if(err) {
					res.writeHead(400, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": false, "reason": "Duplicate time"}));
				} else {
					res.writeHead(201, {"Content-Type": "application/json"});
					res.end(JSON.stringify({"success": true}));
				}
			});



		} else {
			notFound(res);
		};

	});

});

router.delete('/:username/times', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		if(user) {

			user.times = [];
			user.save(function(err) {

				res.statusCode = 204;
				res.end();

			});

		} else {
			notFound(res);
		}

	});

});

router.post('/:username/sets', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		res.statusCode = 501;
		res.end();

	});

});

router.delete('/:username/sets', function(req, res, next) {

	User.findOne({userName: req.params.username}, function(err, user) {

		res.statusCode = 501;
		res.end();

	});

});





module.exports = router;
