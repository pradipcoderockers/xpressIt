var Transaction = require('../models/XpressItTransaction');
var User = require('../models/XpressItUser');
var LocationController = require('./LocationController');
var Orders = require('../models/XpressItOrder');
var User = require('../models/XpressItUser');
var mongooseConnection = require('../mongooseConnection');
var stripe = require("stripe")(
    mongooseConnection.stripeKey
);

var DeliveryFees = require('../models/XpressItDeliveryFees');
var _ = require('lodash');

var NotificationController = require('./NotificationController');

module.exports = {
    addTransaction: addTransaction,
    getTransaction: getTransaction,
    makePayment: makePayment,
    makeVendorOrderPayment: makeVendorOrderPayment,
    makeUserSubscriptionPayment:makeUserSubscriptionPayment
}

function addTransaction(orderId, userId, cb) {
    var transactionEntry = new Transaction({
        order: orderId,
        userId: userId
    });
    transactionEntry.save(function (err, details) {
        if (err) {
            console.log(err)
        } else {
            cb();

        }
    })

};


function getTransaction(req, res) {
    var transactionId = req.params.transactionId;
    Transaction.find({ _id: transactionId }).populate({ path: 'order' }).exec(function (err, document) {
        if (document) {
            res.json(document);
        }
    })

};


function makePayment(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.amount;
    var deliveryCharges = 0;
    var finalAmount = 0;

    DeliveryFees.findOne({}).exec(function (err, reslt) {

        if (reslt) {
            deliveryCharges = parseFloat(reslt.fees) * 100;
            finalAmount = amount * 100 + deliveryCharges;
            charge();
        }
    });

    function charge() {
        var orderId = req.body.orderId;
        var charge = stripe.charges.create({
            amount: finalAmount,
            currency: 'usd',
            description: orderId,
            source: stripeToken,
        }, function (err, result) {
            if (err) {
                if (err.type === 'StripeCardError') {
                    res.status(500).json({
                        status: err.status,
                        message: 'Payment decline',
                        response: {}
                    })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: 'something went wrong',
                        response: err
                    })
                }
            } else if (result) {

                Transaction.findOneAndUpdate({ order: orderId }, { $set: { paymentStatus: 'done', amount: amount, paymentToken: stripeToken } }, { new: true }, function (err, response) {
                    if (response) {

                        Orders.findOneAndUpdate({ _id: orderId }, { $set: { paid: true } }, { new: true }, function (err, orderupdate) {
                            LocationController.getUserByLatLong(orderupdate.lat, orderupdate.long, callback);

                            function callback(callbackData) {
                                User.find({ role: 1 }).exec(function (err, users) {
                                    tokenList = _.map(users, 'deviceToken');
                                    userList = _.map(users, '_id');
                                    User.findOne({ _id: response.userId }).exec(function (err, customer) {
                                        if (customer) {
                                            NotificationController.sendPushNotification([customer.deviceToken], [customer._id], 0, orderupdate, 0);
                                        }
                                        NotificationController.sendPushNotification(tokenList, userList, 0, orderupdate, 1);
                                    });
                                });
                            }
                        })



                        res.status(200).json({
                            status: 200,
                            message: 'Payment done',
                            response: response
                        })
                    }
                })

            }
        });
    }
}


function makeVendorOrderPayment(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.amount;
    var deliveryCharges = 0;
    var finalAmount = 0;

    DeliveryFees.findOne({}).exec(function (err, reslt) {

        if (reslt) {
            deliveryCharges = parseFloat(reslt.fees) * 100;
            finalAmount = amount * 100 + deliveryCharges;
            charge();
        }
    });

    function charge() {
        var orderIds = req.body.orderId;
        var charge = stripe.charges.create({
            amount: finalAmount,
            currency: 'usd',
            description: orderIds.toString(),
            source: stripeToken,
        }, function (err, result) {
            if (err) {
                if (err.type === 'StripeCardError') {
                    res.status(500).json({
                        status: err.status,
                        message: 'Payment decline',
                        response: {}
                    })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: 'something went wrong',
                        response: err
                    })
                }
            } else if (!err) {
                var counter = 0;
                var allOrders = [];
                _.each(orderIds, function (orderId) {
                    Transaction.findOneAndUpdate({ order: orderId }, { $set: { paymentStatus: 'done', amount: amount, paymentToken: stripeToken } }, { new: true }, function (err, response) {
                        counter++;
                        if (response) {
                            Orders.findOneAndUpdate({ _id: orderId }, { $set: { paid: true } }, { new: true }, function (err, orderupdate) {
                                LocationController.getUserByLatLong(orderupdate.lat, orderupdate.long, callback);
                                function callback(callbackData) {
                                    User.find({ role: 1 }).exec(function (err, users) {
                                        tokenList = _.map(users, 'deviceToken');
                                        userList = _.map(users, '_id');
                                        User.findOne({ _id: response.userId }).exec(function (err, customer) {
                                            if (customer) {
                                                NotificationController.sendPushNotification([customer.deviceToken], [customer._id], 0, orderupdate, 0);
                                            }
                                            NotificationController.sendPushNotification(tokenList, userList, 0, orderupdate, 1);
                                        });
                                    });
                                }
                            })
                            allOrders.push(response);
                            if (counter === orderIds.length)
                                res.status(200).json({
                                    status: 200,
                                    message: 'Payment done',
                                    response: allOrders
                                })
                        }
                    })
                })

            }
        });
    }
}

function makeUserSubscriptionPayment(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = parseFloat(req.body.amount)*100;
    charge();

    function charge() {
        var userId = req.body.userId;
        var charge = stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: userId,
            source: stripeToken,
        }, function (err, result) {
            if (err) {
                if (err.type === 'StripeCardError') {
                    res.status(500).json({
                        status: err.status,
                        message: 'Payment decline',
                        response: {}
                    })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: 'something went wrong',
                        response: err
                    })
                }
            } else if (result) {

                User.findOneAndUpdate({ _id: userId }, { $set: { packagePaymentDone: true, packageAmount: parseFloat(amount), paymentToken: stripeToken } }, { new: true }, function (err, response) {
                    if (response) {

                        res.status(200).json({
                            status: 200,
                            message: 'Payment done',
                            response: response
                        })
                    }
                })

            }
        });
    }
}