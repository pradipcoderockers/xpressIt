var Package = require('../models/Package');
var _ = require('underscore');
module.exports = {
    addPackage: addPackage,
    getAllPackage: getAllPackage,
    getPackageById: getPackageById,
}

function addPackage(req, res) {
    var data = req.body;
    var packageEntry = new Package({
        name: data.name,
        price: data.price,
        description: data.description
    });

    packageEntry.save(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Content Added'
            });
        }
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        }

    })
}


function getAllPackage(req, res) {
    Package.find().exec(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Get content'
            });
        }
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        }

    })

}



function getPackageById(req, res) {

    var packageId=req.params.id;
    Package.find({_id:packageId}).exec(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Get content'
            });
        }
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        }

    })

}