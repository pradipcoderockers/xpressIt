var Orders = require('../models/XpressItOrder');
var TransactionController = require('./XpressItTransactionController');
var _ = require('underscore');
var User = require('../models/XpressItUser');
var DeliveryFees = require('../models/XpressItDeliveryFees');
var NotificationController = require('./NotificationController');
var _ = require('lodash');
module.exports = {
    setOrder: setOrder,
    getOrder: getOrder,
    getOrderByOrderId: getOrderByOrderId,
    updateStatus: updateStatus,
    getCurrentOrderCustomer: getCurrentOrderCustomer,
    getCurrentOrderDeliveryBoy: getCurrentOrderDeliveryBoy,
    getHistoryOrderCustomer: getHistoryOrderCustomer,
    getHistoryOrderDeliveryBoy: getHistoryOrderDeliveryBoy,
    updateDeliveryFees: updateDeliveryFees,
    getDeliveryFees: getDeliveryFees,
    getDeliveryBoysTotalFees: getDeliveryBoysTotalFees,
    getAllCustomersAllOrders: getAllCustomersAllOrders,
    adminGetOrders: adminGetOrders,
    getSales: getSales,
    setVendorOrder: setVendorOrder

}

function setOrder(req, res) {
    var data = req.body; console.log(data);

    var total = 0;
    Orders.find().count().exec(function (err, counting) {
        if (counting) {
            data.customerOrderId = counting;
        }
    });
    total = _.reduce(data.items, function (sum, item) {
        return sum + (parseFloat(item.qty) * parseFloat(item.salePrice));
    }, 0);
    DeliveryFees.findOne({}).exec(function (err, reslt) {
        data.total = total;
        if (reslt) {
            data.fees = reslt.fees;
            data.driverFees = reslt.driverFees
        }
        var orderEntry = new Orders(data);
        var tokenList = [];
        var userList = [];
        orderEntry.save(function (err, result) {
            if (result) {
                TransactionController.addTransaction(result._id, data.userId, function () {
                    res.json({
                        status: 200,
                        message: 'order placed',
                        response: result
                    })
                });

            } else {
                res.json({
                    status: 500,
                    message: err
                })
            }

        })
    })
}

function setVendorOrder(req, res) {
    var data = req.body.data;
    var total = 0;
    var allOrders = [];
    var counter = 0;
    var modifiedParams = {};
    var newData = [];


    modifiedParams = data.reduce(function (result, current) {
        result[current.name] = result[current.name] || [];
        result[current.name].push(current.items);
        return result;
    }, {});

    _.each(_.keys(modifiedParams), function (key) {

        newData.push(_.find(data, function (dat) {
            if (dat.name == key) {
                dat.items = modifiedParams[key];
            }
            return dat.name == key;

        }))
    });
    _.each(newData, function (orderItem) {
        Orders.find().count().exec(function (err, counting) {
            if (counting) {
                orderItem.customerOrderId = counting;
            }
        });
        total = _.reduce(orderItem.items, function (sum, item) {
            return sum + (parseFloat(item.qty) * parseFloat(item.salePrice));
        }, 0);
        DeliveryFees.findOne({}).exec(function (err, reslt) {
            orderItem.total = total;
            if (reslt) {
                orderItem.fees = reslt.fees;
                orderItem.driverFees = reslt.driverFees
            }
            var orderEntry = new Orders(orderItem);
            orderEntry.save(function (err, result) {
                if (result) {
                    allOrders.push(result);
                    TransactionController.addTransaction(result._id, orderItem.userId, function () {
                        counter++;
                        if (counter === newData.length)
                            res.json({
                                status: 200,
                                message: 'order placed',
                                response: allOrders
                            })
                    });

                } else {
                    res.json({
                        status: 500,
                        message: err
                    })
                }

            })
        })

    })
}

function getOrder(req, res) {
    var userId = req.query.userId;

    Orders.find({ userId: userId, paid: true }).populate({
        path: 'userId'
    }).populate({
        path: 'addressId'
    }).exec(
        function (err, result) {
            if (result)
                res.json({
                    status: 200,
                    message: 'order fetched',
                    response: result
                })
            else {
                res.json({
                    status: 500,
                    message: err
                })
            }

        })

}



function getOrderByOrderId(req, res) {
    var orderId = req.query.orderId;

    Orders.findOne({ _id: orderId }).populate({
        path: 'userId'
    }).populate({
        path: 'addressId'
    }).exec(
        function (err, result) {
            if (result)
                res.json({
                    status: 200,
                    message: 'order fetched',
                    response: result
                })
            else {
                res.json({
                    status: 500,
                    message: err
                })
            }

        })

}



function updateStatus(req, res) {
    var orderId = req.body.orderId;
    var deliverBoyId = req.body.userId;
    var status = req.body.status;
    Orders.find({ _id: orderId, status: status }).exec(function (err, orderStatus) {
        if (orderStatus.length === 0) {
            Orders.findOneAndUpdate({ _id: orderId }, { $set: { assignedTo: deliverBoyId, status: status } }, { new: true },
                function (err, result) {
                    if (result) {
                        User.find({ _id: result._doc.userId }).exec(function (err, users) {
                            tokenList = _.map(users, 'deviceToken');
                            userList = _.map(users, '_id');
                            NotificationController.sendPushNotification(tokenList, userList, status, result, 0);
                        })
                        User.findOne({ _id: deliverBoyId }).exec(function (err, deliveryBoyInfo) {
                            NotificationController.sendPushNotification([deliveryBoyInfo.deviceToken], [deliveryBoyInfo._id], status, result, 1);
                        })
                        res.json({
                            status: 200,
                            message: 'order fetched',
                            response: result
                        })
                    } else {
                        res.json({
                            status: 500,
                            message: err
                        })
                    }

                })
        }
        if (orderStatus.length === 1) {
            res.json({
                status: 500,
                message: 'Order is already processed'
            })
        }
        if (err) {
            res.json({
                status: 500,
                message: err
            })
        }
    })
}

function getCurrentOrderCustomer(req, res) {
    var userId = req.query.userId;
    var skip = parseInt(req.query.skip) || 0;
    Orders.find({ userId: userId, status: { $in: [0, 1] }, paid: true }).sort({ createdAt: -1 }).skip(skip).limit(10).exec(function (err, result) {
        if (result)
            res.json({
                status: 200,
                message: 'order fetched',
                response: result
            })
        else {
            res.json({
                status: 500,
                message: err
            })
        }
    })
}

function getHistoryOrderCustomer(req, res) {
    var userId = req.query.userId;
    var skip = parseInt(req.query.skip) || 0;
    Orders.find({ userId: userId, status: 2, paid: true }).sort({ createdAt: -1 }).skip(skip).limit(10).exec(function (err, result) {
        if (result)
            res.json({
                status: 200,
                message: 'order fetched',
                response: result
            })
        else {
            res.json({
                status: 500,
                message: err
            })
        }
    })
}

function getCurrentOrderDeliveryBoy(req, res) {
    var userId = req.query.userId;
    var skip = parseInt(req.query.skip) || 0;
    Orders.find({ assignedTo: userId, status: 1, paid: true }).sort({ createdAt: -1 }).skip(skip).limit(10).exec(function (err, result) {
        if (result)
            res.json({
                status: 200,
                message: 'order fetched',
                response: result
            })
        else {
            res.json({
                status: 500,
                message: err
            })
        }
    })
}


function getHistoryOrderDeliveryBoy(req, res) {
    var userId = req.query.userId;
    var skip = parseInt(req.query.skip) || 0;
    Orders.find({ assignedTo: userId, status: 2, paid: true }).sort({ createdAt: -1 }).skip(skip).limit(10).exec(function (err, result) {
        if (result)
            res.json({
                status: 200,
                message: 'order fetched',
                response: result
            })
        else {
            res.json({
                status: 500,
                message: err
            })
        }
    })
}

function updateDeliveryFees(req, res) {
    var fees = req.body.fees;
    DeliveryFees.update({}, { $set: { fees: fees } }, { new: true, upsert: true },
        function (err, result) {
            if (result) {
                res.json({
                    status: 200,
                    message: 'order fetched',
                    response: result
                })
            } else {
                res.json({
                    status: 500,
                    message: err
                })
            }
        })
}

function getDeliveryFees(req, res) {
    DeliveryFees.findOne({}).exec(
        function (err, result) {

            if (result) {
                res.json({
                    status: 200,
                    message: 'order fetched',
                    response: result
                })
            } else {
                res.json({
                    status: 500,
                    message: err
                })
            }
        })
}


function getDeliveryBoysTotalFees(req, res) {
    var userId = req.body.userId;
    var total = {
        totalEarning: 0,
        totalOrders: 0
    }
    Orders.find({ assignedTo: userId, status: 2, paid: true }).exec(function (err, result) {

        _.each(result, function (val) {
            total.totalEarning = total.totalEarning + parseFloat(val.fees);
        })
        total.totalOrders = result.length;
        res.json({
            status: 200,
            message: 'order fetched',
            response: total
        })
    })
}



function getAllCustomersAllOrders(req, res) {
    var userId = req.body.userId;
    Orders.find({ userId: userId }).exec(function (err, result) {

        res.json(result)
    })
}

function adminGetOrders(req, res) {
    var status = req.query.status;
    var skip = parseInt(req.query.skip);
    var limit = parseInt(req.query.limit);
    var query = {};
    if (status !== 'all') {
        query.status = status;
    }

    Orders.find(query).skip(skip).limit(limit).exec(function (err, result) {

        res.json(result)
    })

}

function getSales(req, res) {
    var type = parseInt(req.body.saleType); //0 daily 1 weekly 2 monthly 3 quarterly 4 years 5 overall
    var queryWallmart = {};
    var queryVendor = {};
    var time = new Date().setHours(0, 0, 0, 0);
    var finalResult = {
        wallmart: 0,
        vendor: 0
    }
    var oneDayTime = 24 * 60 * 60 * 1000;
    var queryTime;
    switch (type) {
        case 0:
            queryTime = time;
            break;
        case 1:
            queryTime = time - 7 * oneDayTime;
            break;
        case 2:
            queryTime = time - 30 * oneDayTime;
            break;
        case 3:
            queryTime = time - 90 * oneDayTime;
            break;
        case 4:
            queryTime = time - 365 * oneDayTime;
            break;
    }
    queryWallmart = { 'createdAt': { $gt: new Date(queryTime) }, "customerOrderId": { $exists: false } }
    queryVendor = { 'createdAt': { $gt: new Date(queryTime) }, "customerOrderId": { $exists: true } }

    Orders.aggregate({
        $match: queryWallmart
    }, { $group: { _id: null, sum: { $sum: "$total" } } }, function (err, result) {
        if (result) {
            if (result.length > 0) {
                finalResult.wallmart = result[0].sum;
            }
            Orders.aggregate({
                $match: queryVendor
            }, { $group: { _id: null, sum: { $sum: "$total" } } }, function (err, result) {
                if (result) {
                    if (result.length > 0) {
                        finalResult.vendor = result[0].sum;
                    }
                }
                res.json(finalResult);
            });
        }
    });

}