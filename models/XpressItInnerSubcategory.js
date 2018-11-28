var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItInnerSubcategorySchema = Schema({
    categoryId: { type: String, required: true, trim: true },
    subcategoryId: { type: String, required: true, trim: true },
    innerSubcategoryId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true }


}, {
        timestamps: true,
        collection: "XpressItInnerSubcategory"
    });


//Model Declarations
var XpressItInnerSubcategory = mongoose.model('XpressItInnerSubcategory', XpressItInnerSubcategorySchema);

module.exports = XpressItInnerSubcategory;