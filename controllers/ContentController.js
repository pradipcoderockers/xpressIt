var Content = require('../models/Content');
var _ = require('underscore');
module.exports = {
    addContent: addContent,
    getContent: getContent
}

function addContent(req, res) {
    var data = req.body;
    var contentEntry = new Content({
        heading: data.heading,
        content: data.content,
        type: data.type
    });

    contentEntry.save(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Content Added'
            });
        }
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        }

    })
}


function getContent(req, res) {
    var response = { newStore: [], localCentral: [] };
    Content.find().exec(function (err, result) {
        if (result) {
            response.localCentral = _.filter(result, function (data) {
                return data.type == 0
            });
            response.newStore = _.filter(result, function (data) {
                return data.type == 1
            })




            res.json({
                response: response || {},
                status: 200,
                message: 'Get content'
            });
        }
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        }

    })

}