var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var port = 8083;
var dbPath = 'mongodb://localhost:27017/xpessit';
var live = "sk_live_FDAGD0APJEBJhZTJSNIkXL80";
var dev = "sk_test_7usOH1agjIcDtzlRyM64lhCy";
var stripeKey = dev;
module.exports = { "mongoose": mongoose, port: port, dbPath: dbPath, stripeKey: stripeKey };
