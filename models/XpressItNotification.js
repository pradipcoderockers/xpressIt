var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var NotificationSchema = Schema({
    userId: { type: String },
    content: {},
    data: {},
    delete: { type: Boolean, default: false }
}, {
        timestamps: true,
        collection: "Notification"
    });


//Model Declarations
var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;