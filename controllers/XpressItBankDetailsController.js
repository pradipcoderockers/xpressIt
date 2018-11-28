var XpressItBankDetails = require('../models/XpressItBankDetails');
var _ = require('underscore');
module.exports = {
    addBankDetails: addBankDetails,
    getBankBankDetails: getBankBankDetails,
    editBankBankDetails: editBankBankDetails,
    getBankBankDetailsByUserId: getBankBankDetailsByUserId
}

function addBankDetails(req, res) {

    var details = req.body;

    XpressItBankDetails.find({ userId: details.userId }).exec(function (err, totalCount) {
        if (totalCount && totalCount.length === 0) {
            var XpressItBankDetailsEntry = new XpressItBankDetails(details);
            XpressItBankDetailsEntry.save(function (err, document) {
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
        }
        if (totalCount && totalCount.length > 0) {
            XpressItBankDetails.findOneAndUpdate({ userId: details.userId }, { $set: details }, { new: true }, function (err, document) {
                if (document) {
                    res.json({
                        status: 200,
                        message: 'bank updated',
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
        }
        if (err) {
            res.status(err.status).json({
                status: err.status,
                message: err.message,
                response: {}
            })

        }

    })


}


function getBankBankDetails(req, res) {
    var bankId = req.query.bankId;
    XpressItBankDetails.find({ _id: bankId }).exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'bank fetched',
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



function getBankBankDetailsByUserId(req, res) {

    var userId = req.query.userId;
    XpressItBankDetails.find({ userId: userId }).exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'bank fetched',
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

function editBankBankDetails(req, res) {
    var details = req.body;
    XpressItBankDetails.findOneAndUpdate({ userId: details.userId }, { $set: details }, { new: true }, function (err, document) {
        if (document) {
            res.json({
                status: 200,
                message: 'bank updated',
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

}