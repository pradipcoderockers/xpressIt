var XpressItCategory = require('../models/XpressItCategory');
var XpressItCategoryList = require('../XpressItCategoryList');
var VendorItem = require('../models/XpressItVendorItem');
var _ = require('underscore');
module.exports = {
    createCategory: createCategory,
    getCategory: getCategory
}

function createCategory(req, res) {

    var categoryArray = [];
    _.each(XpressItCategoryList.categories, function (cat) {
        categoryArray.push({
            categoryId: cat.id,
            name: cat.name,
            path: cat.path
        })
    });
    XpressItCategory.insertMany(categoryArray, function (err, details) {
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


function getCategory(req, res) {
    XpressItCategory.find().exec(function (err, document) {

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
