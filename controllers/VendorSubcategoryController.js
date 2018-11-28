var VendorSubcategory = require('../models/VendorSubcategory');
var _ = require('underscore');
module.exports = {
    createSubcategory: createSubcategory,
    getSubcategory: getSubcategory
}

function createSubcategory(req, res) {

    var name = req.body.name;
    var categoryId = req.body.categoryId;

    var categoryEntry = new VendorSubcategory({
        name: name,
        categoryId: categoryId
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
                message: 'SubCategory Added'
            });
        }
    })
}





function getSubcategory(req, res) {
    var categoryId = req.query.categoryId;
    VendorSubcategory.find({ categoryId: categoryId }).exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'subcategory fetched',
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