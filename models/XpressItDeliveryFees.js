var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var DeliveryFeesSchema = Schema({
    fees: { type: String, required: true, trim: true, default: 0 },
    driverFees: { type: String, required: true, trim: true, default: 0 },
}, {
        timestamps: true,
        collection: "XpressItDeliveryFees"
    });


//Model Declarations
var DeliveryFees = mongoose.model('XpressItDeliveryFees', DeliveryFeesSchema);

module.exports = DeliveryFees;