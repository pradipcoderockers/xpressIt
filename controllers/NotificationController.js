var twilioClient = require('twilio')('ACa28cf20184ac1b61e9b0d5d627994ff5', '097394ceff32fb7a2e04d521c7a9565f');
var mailgun = require('mailgun-js')({ apiKey: 'key-c013f8570ec1c478428b565345389922', domain: 'mg.wodeliver.com' });
var fcmServerKeyDriver = "AIzaSyAeTGwhUoKFd5DEtGPmSAdISSMH1rCIFUA";
var fcmServerKeyCustomer = "AIzaSyAOvps6wX06XB_HXcfDaA8TceaGLVGd0-A";
var FCM = require('fcm-push');
var _ = require('lodash');
var Notification = require('../models/XpressItNotification');
module.exports = {
    sendSMS: sendSMS,
    sendEmail: sendEmail,
    getNotifications: getNotifications,
    sendPushNotification: sendPushNotification,
    getNotificationType: getNotificationType,
    testPush: testPush
}

function sendSMS(number, otp, cb) {
    var message = number + '' + otp;

    twilioClient.messages.create({
        to: number,
        from: '+3197004499368',
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    }, function (err, message) {
        console.dir(err);

        cb();
    });
}

function sendEmail(message) {

    mailgun.messages().send(message, function (error, body) { })
}

function sendPushNotification(tokens, userList, notificationType, data, role) {

    var notificationData = [];
    var content = getNotificationType(parseInt(notificationType), role);
    _.each(userList, function (user) {
        notificationData.push({ userId: user, content: content, data: data })
    })
    var fcm = role === 1 ? (new FCM(fcmServerKeyDriver)) : (new FCM(fcmServerKeyCustomer));
    var message = {
        registration_ids: _.uniq(tokens),
        data: data || {},
        "priority": "high",
        notification: {
            title: content.title,
            body: content.body
        }
    };

    Notification.update({ "data._id": data._id }, { $set: { delete: true } }, { multi: true }, function (err, success) {

        Notification.insertMany(notificationData, function (err, result) { })

        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong !");
            } else {
                console.log("Successfully sent with resposne :", response);
            }
        });
    })


}


function getNotifications(req, res) {
    var userId = req.query.userId;
    var skip = parseInt(req.query.skip) || 0;
    Notification.find({ userId: userId, delete: false }).sort({ createdAt: -1 }).skip(skip).limit(10).exec(function (err, result) {
        if (err) {
            res.status(err.status).json({
                status: err.status,
                message: err.message,
                response: {}
            })
        } else {
            res.status(200).json({
                status: 200,
                message: 'notification',
                response: result
            })
        }
    })
}



function getNotificationType(type, role) {

    var content = {};
    if (role === 1) {
        switch (type) {
            case 0:
                content = { body: 'Delivery Avaiable', title: 'Order Placed' }
                break;
            case 1:
                content = { body: 'Thanks for Accepting delivery', title: 'Order Assigned' }
                break;
            case 2:
                content = { body: 'Order completed', title: 'Order Delivered' }
                break;
        }
    } else {
        switch (type) {
            case 0:
                content = { body: 'A new ORDER is placed', title: 'Order Placed' }
                break;
            case 1:
                content = { body: 'Your order has been assigned', title: 'Order Assigned' }
                break;
            case 2:
                content = {
                    body: 'Thanks for shopping with Xpressit',
                    title: 'Order Delivered'
                }
                break;
        }
    }
    return content;
}

function testPush(req, res) {

    var notificationData = [];
    var content = getNotificationType(parseInt(1));

    var fcm = new FCM(fcmServerKeyDriver);
    var message = {
        registration_ids: _.uniq(['dHB0xk5EUog:APA91bHPRtgP0ZGG01_vynZdaTfyjUcUjsWsp2wFBWPNEj6jJWHa2Txk0qZoCNl5EVXu3367wDEl27ec17CG-8tnUrOAkn2CmNJE2CvxIok200qjwawogIN-7tK4ZaSX133aawLRY-kt']),
        data: { name: "guru", type: 2 },
        "priority": "high",
        notification: {
            title: content.title,
            body: content.body
        }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong !");
            res.json({ resp: "Something has gone wrong !" });
        } else {

            res.json({
                resp: "Successfully sent with resposne: " + response
            });
            console.log("Successfully sent with resposne :", response);
        }
    });
}