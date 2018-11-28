var XpressItInnerSubcategory = require('../models/XpressItInnerSubcategory');
var XpressItCategoryList = require('../XpressItCategoryList');
var _ = require('underscore');
module.exports = {
    createInnerSubcategory: createInnerSubcategory,
    getInnerSubcategory: getInnerSubcategory
}

function createInnerSubcategory(req, res) {

    var innerSubcategoryArray = [];
    _.each(XpressItCategoryList.categories, function (cat) {
        _.each(cat.children, function (subcat) {
            _.each(subcat.children, function (innerSubcat) {
                innerSubcategoryArray.push({
                    categoryId: cat.id,
                    subcategoryId: subcat.id,
                    innerSubcategoryId: innerSubcat.id,
                    name: innerSubcat.name,
                    path: innerSubcat.path
                })
            });
        });
    });
    XpressItInnerSubcategory.insertMany(innerSubcategoryArray, function (err, details) {
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


function getInnerSubcategory(req, res) {
    var subcategoryId = req.query.subcategoryId;
    XpressItInnerSubcategory.find({ subcategoryId: subcategoryId }).exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'inner subcategory fetched',
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