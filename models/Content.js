var connection = require('../mongooseConnection');
var mongoose = connection.mongoose;
var Schema = mongoose.Schema;

//Schema Declarations
var ContentSchema = Schema({
    heading: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    type: { type: Number, required: true, trim: true }, //0 for local central 1 for new store
}, {
        timestamps: true,
        collection: "Content"
    });


//Model Declarations
var Content = mongoose.model('Content', ContentSchema);

module.exports = Content;