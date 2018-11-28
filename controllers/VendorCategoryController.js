var VendorCategory = require('../models/VendorCategory');
var _ = require('underscore');
module.exports = {
    createCategory: createCategory,
    getCategory: getCategory
}

function createCategory(req, res) {

    var name = req.body.name;

    var categoryEntry = new VendorCategory({
        name: name
    });
    categoryEntry.save(function (err, details) {
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })

        } else {
            res.json({
                response: details || {},
                status: 200,
                message: 'Category Added'
            });
        }
    })
}


function getCategory(req, res) {
    VendorCategory.find().exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'category fetched',
                response: document
            })
        }
        if (err) {
            res.status(err.status).json({
                status: err.status,
                message: err.message,
                response: {}
            })
        }
    })
};