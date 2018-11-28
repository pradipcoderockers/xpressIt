var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var PackageSchema = Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true }, 
}, {
        timestamps: true,
        collection: "Package"
    });


//Model Declarations
var Package = mongoose.model('Package', PackageSchema);

module.exports = Package;