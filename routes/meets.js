var express = require('express');
var router = express.Router();
var Meet = require('../models/meet.js');
// var User = require('../models/user.js');


var notFound = function(response) {

	response.writeHead(404, {"Content-Type": "application/json"});
	response.end(JSON.stringify({"success": false, "reason": "Meet not found."}));

}

var badRequest = function(response, message) {

  response.writeHead(400, {"Content-Type": "application/json"});
  response.end(JSON.stringify({"success": false, "reason": message}));

}


router.post('/', function(req, res, next) {
  var meet = new Meet();
  meet.name = req.body.name;
  meet.dates = [];
	if(req.body.dates) {
		req.body.dates.split(";").forEach(function(entry) {
			meet.dates.push(entry);
		});
	}
  meet.country = req.body.country;
  meet.state = req.body.state;
  meet.city = req.body.city;
  meet.admin = req.decoded.userName; //has to be the id of the person posting, do some kind of check
  meet.meetType = req.body.meetType;
  meet.live = false;
  meet.currentEvent = {event: 1, heat: 1};
  meet.events = [];
  meet.timers = [];
  meet.swimmers = [];

	console.log(req.decoded);
	console.log(req.decoded.userName);
	console.log(meet);

  meet.save(function(err) {

    if(err) {
			res.writeHead(400, {"Content-Type": "application/json"});
			res.end(JSON.stringify({"created": false, "reason": "Meet post did not match the required schema."}));
		} else {
			res.writeHead(201, {"Content-Type": "application/json"});
			res.end(JSON.stringify({"created":true, "id": meet._id}));
		}

  });
});

router.get('/', function(req, res, next) {
  Meet.find(function(err, meets) {
    if(err) {
      res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("Could not retrieve meets");
    } else {
      res.json(meets);
    }
  });
});

router.get('/meetId/:meetId', function(req, res, next) {
    Meet.findOne({_id: req.params.meetId}, function(err, meet) {
      if(meet) {
        res.json(meet);
      } else {
        console.log(err);
        notFound(res);
        // res.writeHead(400, {"Content-Type": "application/json"});
        // res.end(JSON.stringify({"success": false, "reason": "Meet not found"}));
      }
    });
});

router.delete('/meetId/:meetId', function(req, res, next) {
  Meet.remove({_id: req.params.meetId}, function(err) {

    if(err) {
      console.log(err);
      badRequest(res, "unknown");
      // res.writeHead(400, {"Content-Type": "application/json"});
      // res.end(JSON.stringify({"deleted": false, "reason": "unknown"}));
    } else {
      res.statusCode = 204;
      res.end();
    }

  });
});

router.post('/:meetId/event', function(req, res, next) {
  Meet.findOne({_id: req.params.meetId}, function(err, meet) {
    if(meet) {
      var event = {
        name: req.body.name,                //"200 Yard Girls Freestyle"
        eventNum: req.body.eventNum,        //3
        heats: req.body.heats,              //2
        stroke: req.body.stroke,            //freestyle
        distance: req.body.distance,        //200
        measurement: req.body.measurement,  //SCY
        ageRange: req.body.ageRange,        //Open
        gender: req.body.gender             //0 = boys, 1 = girls, 2 = mixed, 3 = other
      }
      if(meet.events.length < req.body.eventNum) {
        event.eventNum = meet.events.length + 1;

        meet.events.push(event);
        meet.save(function(err) {

          if(err) {
            badRequest(res, "Did not conform to model.");
            // res.writeHead(400, {"Content-Type": "application/json"});
            // res.end(JSON.stringify({"success": false, "reason": "Did not conform to model."}));
          } else {
            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify({"success": true}));
          }

        });


      } else {
        badRequest(res, "Can only append event to end.");
        // res.writeHead(400, {"Content-Type": "application/json"});
        // res.end(JSON.stringify({"success": false, "reason": "Can only append event to end."}));
      }
    } else {
      notFound(res);
    }
  });
});

/* Would like to implement this method without sorting, just 2 event searches with O(numEvents) time */
router.patch('/:meetId/event/:eventId', function(req, res, next) {
  Meet.findOne({_id: req.params.meetId}, function(err, meet) {

    if(meet) {
      var curEvent = -1;

      //find the event in the events array
      for(var i = 0; i < meet.events.length; i++) {
        if(req.params.eventId == meet.events[i]._id) {
          curEvent = i;
          break; //found the event, break out of loop early
        }
      }


      if(curEvent != -1) {
        var oldEventNum = meet.events[curEvent].eventNum; //record one endpoint of the swap (if there is one)
				console.log(req.body.eventNum);
				console.log(meet.events.length);
				if(req.body.eventNum <= meet.events.length) { /* ok to swap event nums */

					for(var i = 0; i < meet.events.length; i++) {
						if(req.body.eventNum == meet.events[i].eventNum) { //checking to see if this event is the event to swap with
							meet.events[i].eventNum = oldEventNum;
							break; //found the event, break out of loop early
						}
					}


					for(var field in req.body) { //patching variables in request body
						if(field != "_id") {
							meet.events[curEvent][field] = req.body[field];
						}
          }

					meet.save(function(err) {
						if(err) {
							badRequest(res, "Does not conform to event model.");
						} else {
							res.writeHead(200, {"Content-Type": "application/json"});
							res.end(JSON.stringify({"success": true}));
						}
					});



        } else {
          badRequest(res, "Event number invalid (too large.)");
        }
      }
      else {
        notFound(res);
      }


    } else {
      notFound(res);
    }

  });
});

/* Mass delete event function */
router.delete('/:meetId/event', function(req, res, next) {

	Meet.findOne({_id: req.params.meetId}, function(err, meet) {

		if(meet) {
			meet.events = [];
			meet.save(function(err) {
				if(err) {
					badRequest(res, "unknown");
				} else {
					res.statusCode = 204;
					res.end();
				}
			});
		} else {
			notFound(res);
		}

	});

});

router.delete('/:meetId/event/:eventId', function(req, res, next) {

	Meet.findOne({_id: req.params.meetId}, function(err, meet) {

		if(meet) {

      //find the event in the events array
      for(var i = 0; i < meet.events.length; i++) {
        if(req.params.eventId == meet.events[i]._id) {
          meet.events.splice(i, 1);
          break; //found the event, break out of loop early
        }
      }
			meet.save(function(err) {
				if(err) {
					badRequest(res, "unknown");
				} else {
					res.statusCode = 204;
					res.end();
				}
			});
		} else {
			notFound(res);
		}

	});

});


module.exports = router;
