var mongoose = require("mongoose"),
	Schema = mongoose.Schema();
	
var meetSchema = new Schema({
	
	name: {type: String, required: true},
	dates: {type: [Date], required: true},
	country: {type: String, required: true},
	state: {type: String},
	city: {type: String, required: true},
	events: [{name: String, eventNum: Number, heats: Number, stroke: String, distance: Number, measurement: String, ageRange: String, gender: Number}], //boys = 0, girls = 1, mixed = 2, other = 3
	meetType: {type: String}, //aka USA Swimming, YMCA, high school.
	swimmers: [{firstName: String, lastName: String, events: [{num: Number, heat: Number: lane: Number, seedTime: String}] }],
	timers: [{userId: String, lane: Number}]
	live: Boolean,
	currentEvent: {event: Number, heat: Number}

});

module.exports = mongoose.model('Meet', meetSchema);