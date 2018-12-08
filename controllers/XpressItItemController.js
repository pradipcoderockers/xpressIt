var walmart = require('../WalmartConfig').walmart;
var _ = require('underscore');
var VendorItem = require('../models/XpressItVendorItem');
module.exports = {
    getItemList: getItemList,
    getItemReview: getItemReview,
    searchItem: searchItem,
    addProduct: addProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    getVendorProduct: getVendorProduct,
    getProductBySubcategory: getProductBySubcategory,
    getProductByText: getProductByText,
    getVendorProductBySubCategory: getVendorProductBySubCategory
}
var requiredFields = ['itemId', 'parentItemId', 'name', 'msrp', 'salePrice', 'longDescription', 'color', 'stock', 'thumbnailImage', 'mediumImage', 'largeImage']

function getItemList(req, res) {
    var params = req.query.params;

    walmart.feeds.bestSellers(params).then(function (result) {
        if (result) {

            res.json({
                status: 200,
                message: 'stores fetched',
                response: mapping(result.items)
            })
        }
    }, function (err) {
        res.status(500).json({
            status: 500,
            message: 'Error',
            response: err
        })
    })
}


function getItemReview(req, res) {
    var itemId = req.query.itemId;
    walmart.reviews(itemId).then(function (result) {
        res.json(result);
    });
}

function searchItem(req, res) {
    var searchParam = req.query.search;
    walmart.search(searchParam, []).then(function (result) {
        if (result) {

            res.json({
                status: 200,
                message: 'stores fetched',
                response: mapping(result.items)
            })
        }
    }, function (err) {
        res.status(500).json({
            status: 500,
            message: 'Error',
            response: err
        })
    });
}

function mapping(items) {
    var list = [];

    _.each(items, function (item) {
        var localItem = {};
        localItem.imageEntities = {};
        _.each(requiredFields, function (field) {
            if (field === 'thumbnailImage' || field === 'mediumImage' || field === 'largeImage')
                localItem.imageEntities[field] = item[field];
            else
                localItem[field] = item[field];
        })
        list.push(localItem);
    })
    return list;
}

function addProduct(req, res) {
    var item = req.body;
    getValueForNextSequence(saveData);

    function saveData(itemId) {
        var itemEntry = new VendorItem({
            itemId: itemId,
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category.path,
            vendorId: item.vendorId,
            categoryId: item.category.categoryId,
            subCategoryId: item.subcategory.subcategoryId,
            imageLink: item.image

        });
        itemEntry.save(function (err, details) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    response: err
                })

            } else {
                res.status(200).json({
                    status: 200,
                    message: 'products list',
                    response: details
                })
            }

        })
    }
}

function editProduct(req, res) {
    var item = req.body;
    item.categoryId = item.category.categoryId;
    item.subCategoryId = item.subcategory.subcategoryId;
    VendorItem.findOneAndUpdate({ itemId: item.itemId }, { $set: item }, { new: true }, function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}

function deleteProduct(req, res) {
    var _id = req.body.productId;
    VendorItem.findOneAndUpdate({ _id: _id }, { $set: { deleted: true } }, { new: true }, function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}

function getVendorProduct(req, res) {
    var vendorId = req.query.vendorId;
    VendorItem.find({ vendorId: vendorId, deleted: false }).exec(function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}

function getVendorProductBySubCategory(req, res) {
    var vendorId = req.body.vendorId;
    var subCategoryId = req.body.subCategoryId;
    VendorItem.find({ vendorId: vendorId, subCategoryId: subCategoryId, deleted: false }).exec(function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}


function getProductBySubcategory(req, res) {
    var subcategoryId = req.query.subcategoryId;
    VendorItem.find({ subCategoryId: subcategoryId, deleted: false }).exec(function (err, result) {

        if (err) {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}


function getProductByText(req, res) {
    var text = req.query.text;
    VendorItem.find({
        'name': { $regex: req.query.text },
        deleted: false
    }).populate({
        path: 'vendorId'
    }).exec(function (err, result) {

        if (err) {
            res.status(500).json({
                status: 500,
                message: 'error',
                response: err
            })

        }
        res.status(200).json({
            status: 200,
            message: 'products list',
            response: result
        })
    });
}



function getValueForNextSequence(saveData) {

    VendorItem.find().count().exec(function (err, count) {
        console.log(count);
        saveData(count)

    });

}
