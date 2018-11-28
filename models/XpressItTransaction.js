var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var TransactionSchema = Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    paymentStatus: { type: String, required: true, default: 'Pending' }, //if payment is successful then status is completed
    paymentToken: { type: String, required: true, default: 'Pending' },
    amountPaid: { type: String, required: true, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'XpressItUser' },

}, {
        timestamps: true,
        collection: "XpressItTransaction"
    });


//Model Declarations
var Transaction = mongoose.model('XpressItTransaction', TransactionSchema);

module.exports = Transaction;