var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var VendorCategorySchema = Schema({
    name: { type: String, required: true, trim: true },


}, {
        timestamps: true,
        collection: "VendorCategory"
    });


//Model Declarations
var VendorCategory = mongoose.model('VendorCategory', VendorCategorySchema);

module.exports = VendorCategory;