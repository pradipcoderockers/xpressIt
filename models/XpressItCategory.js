var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItCategorySchema = Schema({
    categoryId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true }


}, {
        timestamps: true,
        collection: "XpressItCategory"
    });


//Model Declarations
var XpressItCategory = mongoose.model('XpressItCategory', XpressItCategorySchema);

module.exports = XpressItCategory;