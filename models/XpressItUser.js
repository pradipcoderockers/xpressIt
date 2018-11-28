var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var UserSchema = Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    street: { type: String, trim: true },
    state: { type: String, trim: true },
    zipcode: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    deviceToken: { type: String, trim: true },
    deviceTokenArray: [],
    role: { type: Number, trim: true, default: 0 }, //0: customer 1:driver,2:vendor, 3admin
    policy: { type: String, trim: true },
    organisation: { type: String, trim: true },
    disabled: { type: Boolean, default: false },
    timing: [],
    licence: { type: String, trim: true },
    latLong: {
        lat: { type: Number, },
        long: { type: Number, }
    },
    packageId: { type: String, trim: true,default:null },
    packagePaymentDone: { type: Boolean, trim: true , default:false},
    packageRenewDate: { type: Date, trim: true },
    packageAmount:{type:Number,default:0},
    paymentToken: { type: String, trim: true,default:null },

}, {
        timestamps: true,
        collection: "XpressItUser"
    });


//Model Declarations
var User = mongoose.model('XpressItUser', UserSchema);

module.exports = User;