var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var VendorSubcategorySchema = Schema({
    categoryId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },


}, {
        timestamps: true,
        collection: "VendorSubcategory"
    });


//Model Declarations
var VendorSubcategory = mongoose.model('VendorSubcategory', VendorSubcategorySchema);

module.exports = VendorSubcategory;