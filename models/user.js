var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({

	firstName: {type : String, required : true},
	lastName: {type : String, required : true},
	userName: {type : String, required : true, unique : true},
	birthday: {type: String, required: true},
	email: {type: String, required: true},
	password: {type : String, required : true},
	clubs : [{organization: String, color: String}],
	meets: [{meetId: String, date: Date, name: String, permission: Number}],
	goals: [{meetId: String, event: String, goalType: String, goal: String}],
	sets: [{date: Date, name: String, workout: [{repetitions: Number, distance: Number, stroke: String, interval: String}]}],
	times: [{event: String, performances: [{date: Date, organizationId: String, standard: String, time: String}]}]

});

var User = mongoose.model('User', userSchema);

module.exports = User;
