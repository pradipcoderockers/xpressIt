var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItSubcategorySchema = Schema({
    categoryId: { type: String, required: true, trim: true },
    subcategoryId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true }


}, {
        timestamps: true,
        collection: "XpressItSubcategory"
    });


//Model Declarations
var XpressItSubcategory = mongoose.model('XpressItSubcategory', XpressItSubcategorySchema);

module.exports = XpressItSubcategory;