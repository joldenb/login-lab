var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PirateShipSchema = new Schema({
	name: String,
	crewSize : Number
})

var PirateShip = mongoose.model('PirateShip', PirateShipSchema)
module.exports = PirateShip;