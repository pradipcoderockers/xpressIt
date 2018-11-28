var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItVendorItemSchema = Schema({
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categoryId: { type: String, required: true, trim: true },
    subCategoryId: { type: String, required: true, trim: true },
    imageLink: { type: String, required: true, trim: true, default: 'imageLink' },
    deleted: { type: Boolean, required: true, trim: true, default: false },
    vendorId: { type: Schema.Types.ObjectId, ref: 'XpressItUser' },
    itemId: { type: Number, required: true, trim: true, }, //only for vendorId

}, {
        timestamps: true,
        collection: "XpressItVendorItem"
    });


//Model Declarations
var XpressItVendorItem = mongoose.model('XpressItVendorItem', XpressItVendorItemSchema);

module.exports = XpressItVendorItem;