var mongoose = require('mongoose');


var schemaInfore = new mongoose.Schema({
	Name: 'string',
	Linkfb: 'string',
	Sex: 'string',
	BirthDay: 'string',
	PhoneNum: 'string',
	Email: 'string',
	// Img:'string'

});
module.exports = mongoose.model("Intership", schemaInfore);