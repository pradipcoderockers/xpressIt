var XpressItSubcategory = require('../models/XpressItSubcategory');
var XpressItCategoryList = require('../XpressItCategoryList');
var _ = require('underscore');
module.exports = {
    createSubcategory: createSubcategory,
    getSubcategory: getSubcategory
}

function createSubcategory(req, res) {

    var subcategoryArray = [];
    _.each(XpressItCategoryList.categories, function (cat) {
        _.each(cat.children, function (subcat) {
            subcategoryArray.push({
                categoryId: cat.id,
                subcategoryId: subcat.id,
                name: subcat.name,
                path: subcat.path
            })
        });
    });
    XpressItSubcategory.insertMany(subcategoryArray, function (err, details) {
        {
            if (details) {
                res.json({
                    status: 200,
                    message: 'category Saved ',
                    response: details
                })
            }
            if (err) {
                res.status(err.status).json({
                    status: err.status,
                    message: err.message,
                    response: {}
                })
            }

        };
    })
}





function getSubcategory(req, res) {
    var categoryId = req.query.categoryId;
    XpressItSubcategory.find({ categoryId: categoryId }).exec(function (err, document) {

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