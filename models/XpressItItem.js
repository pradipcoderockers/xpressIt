var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItItemSchema = Schema({
    itemId: { type: String, required: true, trim: true },
    parentItemId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    msrp: { type: String, required: true, trim: true },
    salePrice: { type: String, required: true, trim: true },
    categoryPath: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, required: true, trim: true },
    thumbnailImage: { type: String, required: true, trim: true },
    mediumImage: { type: String, required: true, trim: true },
    largeImage: { type: String, required: true, trim: true },
    productTrackingUrl: { type: String, required: true, trim: true },
    standardShipRate: { type: String, required: true, trim: true },
    marketplace: { type: String, required: true, trim: true },
    modelNumber: { type: String, required: true, trim: true },
    sellerInfo: { type: String, required: true, trim: true },
    productUrl: { type: String, required: true, trim: true },
    categoryNode: { type: String, required: true, trim: true },
    availableOnline: { type: String, required: true, trim: true },
}, {
        timestamps: true,
        collection: "XpressItItem"
    });


//Model Declarations
var XpressItItem = mongoose.model('XpressItItem', XpressItItemSchema);

module.exports = XpressItItem;