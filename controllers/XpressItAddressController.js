var Address = require('../models/XpressItAddress');
var bcrypt = require('bcryptjs');
module.exports = {
    setAddress: setAddress,
    getAddress: getAddress,
    getUserAddresses: getUserAddresses,
    editAddress: editAddress
}

function setAddress(req, res) {
    var addressData = req.body;
    var userId = req.query.userId;


    var addressEntry = new Address({
        phone: addressData.phone,
        userId: addressData.userId,
        address1: addressData.address1,
        address2: addressData.address2,
        state: addressData.state,
        zipcode: addressData.zipcode,
        country: addressData.country,
        city: addressData.city,
    });
    addressEntry.save(function (err, details) {
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })

        } else {
            res.json({
                response: details || {},
                status: 200,
                message: 'User Signed In'
            });
        }
    })

};

function editAddress(req, res) {
    var addressData = req.body;
    Address.findOneAndUpdate({ _id: addressData._id }, { $set: addressData }, { upsert: true, new: true }, function (err, details) {
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })

        } else {
            res.json({
                response: details || {},
                status: 200,
                message: 'User editted In'
            });
        }
    })
};

function getAddress(req, res) {
    var addressId = req.query.addressId;
    Address.findOne({ _id: addressId }).exec(
        function (err, document) {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: err.message,
                    response: {}
                })
            } else {
                res.json({
                    response: document || {},
                    status: 200,
                    message: 'User Signed In'
                });
            }
        });
};

function getUserAddresses(req, res) {
    var userId = req.query.userId;
    Address.find({ userId: userId }).limit(5).sort({ createdAt: -1 }).exec(
        function (err, document) {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: err.message,
                    response: {}
                })
            } else {
                res.json({
                    response: document || {},
                    status: 200,
                    message: 'User Signed In'
                });
            }
        });
};