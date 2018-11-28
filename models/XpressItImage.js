var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var ImageSchema = Schema({
    imageId: { type: String, trim: true },
    imageLink: { type: String, trim: true }

}, {
        timestamps: true,
        collection: "XpressItImage"
    });


//Model Declarations
var XpressItImage = mongoose.model('XpressItImage', ImageSchema);

module.exports = XpressItImage;