var User = require('../models/XpressItUser');
var bcrypt = require('bcryptjs');
var NotificationController = require('./NotificationController');
var ImageController = require('./XpressItImageController');
module.exports = {
    userSignUp: userSignUp,
    userLoginMechanism: userLoginMechanism,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    getUserInfo: getUserInfo,
    editUser: editUser,
    tokenUpdate: tokenUpdate,
    logout: logout,
    getCustomerList: getCustomerList,
    getVenderList: getVenderList,
    updateVendorAccountStatus: updateVendorAccountStatus,
    getUserLoggedInfo: getUserLoggedInfo,
    vendorByLocation: vendorByLocation
}

function tokenUpdate(req, res) {
    var userId = req.body.userId;
    var deviceToken = req.body.deviceToken;
    User.update({ _id: userId }, { $set: { deviceToken: deviceToken }, $addToSet: { deviceTokenArray: deviceToken } }, { new: true }, function (err, resp) {
        res.json({
            userData: resp,
            status: 200,
            message: 'User Signed In'
        });
    })
}


function logout(req, res) {
    var userId = req.body.userId;
    User.update({ _id: userId }, { $unset: { deviceToken: "" } }, { new: true }, function (err, resp) {
        res.json({
            userData: resp,
            status: 200,
            message: 'User Signed In'
        });
    })
}

function userSignUp(req, res) {
    var user = req.body;
    User.findOne({ email: user.email }, function (err, document) {
        if (!document) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    res.status(err.status).json({
                        status: err.status,
                        message: err.message,
                        response: {}
                    })
                };
                // hash the password using our new salt


                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            status: 500,
                            message: err.message,
                            response: err
                        })
                    }
                    var userEntry = new User({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        password: hash,
                        phone: user.phone,
                        city: user.city,
                        street: user.street,
                        state: user.state,
                        zipcode: user.zipcode,
                        image: user.image || "imageLink",
                        deviceToken: user.deviceToken,
                        role: user.role,
                        licence: user.licence,
                        policy: user.policy,
                        organisation: user.organisation,
                        disabled: user.role === 2,
                        timing: user.timing,
                        latLong: user.latLong,
                        packageId:user.packageId

                    });
                    userEntry.save(function (err, details) {
                        if (err) {
                            console.log(err);
                            res.json({
                                status: err.status,
                                message: err.message
                            })

                        } else {


                            if (user.role !== 2 && user.image) {

                                ImageController.addImage(details._id, user.image, updateStoreImage, returnResponse);

                            } else {
                                res.json({
                                    userData: details,
                                    status: 200,
                                    message: 'User Signed In'
                                });
                            };

                            function returnResponse(response) {
                                if (parseInt(user.role) === 1) {
                                    ImageController.addLicence(details._id, user.licence, updateLicenceImage);
                                }
                                res.json(response);
                            }

                        }
                    })
                });
            });
        } else if (document) {
            res.status(401).json({
                status: 401,
                message: 'User Already Exists',
                response: {}
            })

        } else {
            if (err) {
                res.json({
                    status: err.status,
                    message: err.message
                })
            }
        }
    })

};


function userLoginMechanism(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var deviceToken = req.body.deviceToken;
    var role = req.body.role;
    var disabled = false;
    console.log(req.body)
    User.findOne({ email: email }).exec(
        function (err, document) {
            if (err) {
                res.status(err.status).json({
                    status: err.status,
                    message: err.message,
                    response: {}
                })
            } else {
                if (document != null) {

                    if (document.disabled && role === 2) {
                        res.json({
                            userData: {},
                            status: 406,
                            message: 'Disabled Account'
                        });
                        return;

                    }
                    bcrypt.compare(password, document.password, function (err, resp) {
                        if (resp) {
                            User.update({ deviceToken: deviceToken }, { $unset: { deviceToken: "" } }, { multi: true }, function (err, resp) {
                                User.update({ _id: document._id }, { $set: { deviceToken: deviceToken } }, { new: true }, function (err, resp) {
                                    res.json({
                                        userData: document,
                                        status: 200,
                                        message: 'User Signed In'
                                    });
                                })
                            });
                        }
                        if (!resp) {
                            res.json({
                                userData: {},
                                status: 401,
                                message: 'Credentials Does Not Match'
                            });
                        }
                        if (err) {
                            res.json({
                                userData: {},
                                status: err.status,
                                message: err.message
                            });
                        }
                    });
                } else {
                    res.json({
                        userData: {},
                        status: 401,
                        message: 'User  Does Not Exists'
                    });
                }
            }
        });
};

function forgotPassword(req, res) {

    var email = req.body.email;
    var newPassword = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        newPassword += possible.charAt(Math.floor(Math.random() * possible.length));


    var message = {
        from: 'XpressIt <no-reply@xpressit.com>',
        to: email,
        subject: "Reset password request",
        text: "XpressIT" +
            "\n----------------------------------------" +
            "\n\nYour new password for XpressIT is :" + newPassword +
            "\n\nUse this password for logging in your account." +
            "\n\nAfter logging in, please change your password by clicking on the Settings gear on the top right of menu." +
            "\n\n----------------------------------------" +
            "\nThanks for using XpressIT"
    };




    bcrypt.genSalt(10, function (err, salt) {
        if (err) return done(err);
        // hash the password using our new salt
        bcrypt.hash(newPassword, salt, function (err, hash) {
            User.update({ email: req.body.email }, { $set: { password: hash } }, { upsert: false },
                function (err, document) {
                    if (document.nModified == 1) {
                        NotificationController.sendEmail(message);
                        res.json({
                            response: {},
                            status: 200,
                            message: 'password changed'
                        });
                    }
                    if (document.nModified == 0) {
                        res.json({
                            response: {},
                            status: 200,
                            message: ''
                        });
                    } else if (err) {
                        res.json({
                            response: {},
                            status: err.status,
                            message: err.message
                        });
                    }

                });
        })
    })


}

function getUserInfo(req, res) {
    var userId = req.query.userId;
    User.findOne({ _id: userId }).select('-password').exec(function (err, result) {

        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })
        } else {
            res.json({
                status: 200,
                message: 'User fetched',
                response: result
            })
        }
    })
}



function changePassword(req, res) {

    var email = req.body.email;
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;

    User.findOne({ email: email }).exec(
        function (err, document) {
            if (err) {
                res.json({
                    status: err.status,
                    message: err.message
                })
            } else {
                if (document != null) {
                    bcrypt.compare(oldPassword, document.password, function (err, result) {
                        if (result) {
                            bcrypt.genSalt(10, function (err, salt) {
                                if (err) {
                                    res.json({
                                        status: err.status,
                                        message: err.message
                                    })
                                }
                                // hash the password using our new salt
                                bcrypt.hash(newPassword, salt, function (err, hash) {
                                    User.update({
                                        email: email,
                                    }, { $set: { password: hash } }, { upsert: false },
                                        function (err, document) {
                                            if (document.nModified == 1) {
                                                res.json({
                                                    status: 200,
                                                    message: 'User fetched',
                                                    response: document
                                                })
                                            } else {
                                                if (err) {
                                                    res.json({
                                                        status: err.status,
                                                        message: err.message
                                                    })
                                                }
                                            }
                                        });
                                })
                            })




                        } else {
                            res.json({
                                status: 401,
                                message: 'Old Password Incorrect',
                                response: {}
                            })
                        }
                    });
                } else {
                    res.json({
                        status: 401,
                        message: 'Something went wrong',
                        response: {}
                    })
                }

            }

        });

}


function editUser(req, res) {
    var user = req.body;
    User.findOneAndUpdate({ _id: user._id }, { $set: user }, { upsert: true, new: true }, function (err, document) {
        if (document) {
            if (user.image) {
                ImageController.addImage(user._id, user.image, updateStoreImage, returnResponse)

                function returnResponse(response) {
                    res.json(response);
                }
            } else {
                res.json({
                    userData: document,
                    status: 200,
                    message: 'User Signed In'
                });
            }
        } else {
            if (err) {
                res.json({
                    status: err.status,
                    message: err.message
                })
            }
        }
    })
}




function updateStoreImage(details, cb) {
    if (details.status === 200) {
        User.findOneAndUpdate({ _id: details.response.imageId }, { $set: { image: details.response.imageLink } }, { upsert: false, new: true }, function (err, result) {
            if (err) {
                cb({
                    status: err.status,
                    message: err.message,
                    response: {}
                })

            }
            if (result) {

                cb({
                    status: 200,
                    message: 'user updated',
                    response: result
                })
            }
        })
    }


}



function updateLicenceImage(details) {
    if (details.status === 200) {
        User.findOneAndUpdate({ _id: details.response.imageId }, { $set: { licence: details.response.imageLink } }, { upsert: false, new: true }, function (err, result) {
            if (err) {


            }
            if (result) {


            }
        })
    }


}


function getCustomerList(req, res) {
    User.find({ role: 0 }).exec(function (err, result) {

        if (result) {
            res.json(result);
        } else {
            res.err({ error: 'no record found' });
        }
    })
}

function getVenderList(req, res) {
    User.find({ role: 2 }).exec(function (err, result) {

        if (result) {
            res.json(result);
        } else {
            res.err({ error: 'no record found' });
        }
    })
}

function updateVendorAccountStatus(req, res) {
    var userId = req.body.userId;
    var disabled = req.body.disabled;
    User.findOneAndUpdate({ _id: userId }, { $set: { disabled: disabled } }, { new: true }, function (err, result) {

        if (result) {
            res.json(result);
        } else {
            res.err({ error: 'no record found' });
        }
    })
}

function getUserLoggedInfo(req, res) {

    if (typeof req.user != 'undefined')
        User
            .findOne({ _id: req.user._id }).exec(function (err, user) {
                res.json(user)
            });
};

function vendorByLocation(req, res) {
	console.log(req.query.lat);
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);
    var minLat = lat - .9;
    var maxLat = lat + .9;
    var minLong = long - .9;
    var maxLong = long + .9;
    var query = { 'latLong.lat': { $gt: minLat, $lt: maxLat }, 'latLong.long': { $gt: minLong, $lt: maxLong }, disabled: false };
    User.find(query).exec(function (err, document) {
        if (document) {
            res.json({
                status: 200,
                message: 'stores fetched',
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
