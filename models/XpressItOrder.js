var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItOrdersSchema = Schema({
    items: [{
        itemId: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        salePrice: { type: String, required: true, trim: true },
        qty: { type: String, required: true, trim: true },
        item_image: { type: String, trim: true },
    }],
    userId: { type: Schema.Types.ObjectId, ref: 'XpressItUser' },
    addressId: { type: Schema.Types.ObjectId, ref: 'XpressItAddress' },
    lat: { type: String, required: true, trim: true },
    long: { type: String, required: true, trim: true },
    customerOrderId: { type: String, required: true, trim: true },
    storeNo: { type: Number, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    stateProvocode: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    fees: { type: String, required: true, trim: true, default: 0 },
    total: { type: String, required: true, trim: true, default: 0 },
    status: { type: Number, required: true, trim: true, default: 0 }, //0 placed 1 assigned 2 delivered
    assignedTo: { type: Schema.Types.ObjectId, ref: 'XpressItUser' },
    paid: { type: Boolean, required: true, trim: true, default: false },

}, {
        timestamps: true,
        collection: "XpressItOrders"
    });


//Model Declarations
var XpressItOrders = mongoose.model('XpressItOrders', XpressItOrdersSchema);

module.exports = XpressItOrders;