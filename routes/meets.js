var express = require('express');
var router = express.Router();
var Meet = require('../models/meet.js');


router.post('/', function(req, res, next) {
  var meet = new Meet();
  meet.name = req.body.name;
  meet.dates = [];
  req.body.dates.split(";").forEach(function(entry) {
    meet.dates.push(entry);
  });
  meet.country = req.body.country;
  meet.state = req.body.state;
  meet.city = req.body.city;
  meet.admin = req.body.admin; //has to be the id of the person posting, do some kind of check
  meet.meetType = req.body.meetType;
  meet.live = false;
  meet.currentEvent = {event: 1, heat: 1};
  meet.events = [];
  meet.timers = [];
  meet.swimmers = [];

  meet.save(function(err) {

    if(err) {
			res.writeHead(400, {"Content-Type": "application/json"});
			res.end(JSON.stringify({"created": false}));
		} else {
			res.writeHead(201, {"Content-Type": "application/json"});
			res.end(JSON.stringify({"created":true}));
		}

  });
}


module.exports = router;
