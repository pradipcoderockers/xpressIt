var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var XpressItBankDetailsSchema = Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'XpressItUser' },
    name: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    routingNumber: { type: String, required: true, trim: true },

}, {
        timestamps: true,
        collection: "XpressItBankDetails"
    });


//Model Declarations
var XpressItBankDetails = mongoose.model('XpressItBankDetails', XpressItBankDetailsSchema);

module.exports = XpressItBankDetails;