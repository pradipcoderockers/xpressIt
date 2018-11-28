var Image = require('../models/XpressItImage');
var fs = require('node-fs');
var mv = require('mv');
var _ = require('underscore');
module.exports = {
    addImage: addImage,
    addLicence: addLicence
}

function addImage(imageName, file, cb, returnResponse) {

    var base64Data = file.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFile(imageName + ".png", base64Data, 'base64', function (err) {
        if (err) {
            cb({
                status: err.status,
                message: err.message,
                response: {}
            }, returnResponse)
        }
        var path2 = 'uploads/' + imageName + ".png"
        mv(imageName + ".png", 'public/' + path2, function (data) {
            var imageEntry = new Image({
                imageId: imageName,
                imageLink: path2
            });
            imageEntry.save(function (err, details) {
                if (err) {
                    cb({
                        status: err.status,
                        message: err.message,
                        response: {}
                    }, returnResponse)
                } else {
                    cb({
                        status: 200,
                        message: 'image saved ',
                        response: details
                    }, returnResponse)
                }
            })
        });
    });
};

function addLicence(imageName, file, cb) {

    var base64Data = file.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFile(imageName + ".png", base64Data, 'base64', function (err) {
        if (err) {
            cb({
                status: err.status,
                message: err.message,
                response: {}
            })
        }
        var path2 = 'uploads/licence/' + imageName + ".png"
        mv(imageName + ".png", 'public/' + path2, function (data) {
            var imageEntry = new Image({
                imageId: imageName,
                imageLink: path2
            });
            imageEntry.save(function (err, details) {
                if (err) {
                    cb({
                        status: err.status,
                        message: err.message,
                        response: {}
                    })
                } else {
                    console.log('image licence saved')
                    console.dir(details)
                    cb({
                        status: 200,
                        message: 'image licence saved ',
                        response: details
                    })
                }
            })
        });
    });
};