var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var LocationSchema = Schema({
    userId: { type: String, required: true, trim: true },
    location: {
        lat: { type: Number, },
        long: { type: Number, }
    },
    role: { type: String, required: true, trim: true },
}, {
        timestamps: true,
        collection: "Location"
    });


//Model Declarations
var LocationSchema = mongoose.model('Location', LocationSchema);

module.exports = LocationSchema;