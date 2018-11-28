var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var AddressSchema = Schema({
    phone: { type: String, required: true, trim: true },
    userId: { type: String },
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true },
    state: { type: String, required: true, trim: true },
    zipcode: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
}, {
        timestamps: true,
        collection: "XpressItAddress"
    });


//Model Declarations
var Address = mongoose.model('XpressItAddress', AddressSchema);

module.exports = Address;