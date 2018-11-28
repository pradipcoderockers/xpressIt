var Location = require('../models/Location');
module.exports = {
    getLocationByLatLong: getLocationByLatLong,
    setLocation: setLocation,
    getUserByLatLong: getUserByLatLong,

}

function setLocation(req, res) {
    var data = req.body;
    var LocationEntry = new Location({
        userId: data.userId,
        location: data.location,
        role: data.role
    });

    LocationEntry.save(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Location Added'
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


function getLocationByLatLong(req, res) {
    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);
    var minLat = lat - .1;
    var maxLat = lat + .1;
    var minLong = long - .1;
    var maxLong = long + .1;
    var query = { 'latLong.lat': { $gt: minLat, $lt: maxLat }, 'latLong.long': { $gt: minLong, $lt: maxLong } };
    Location.find(query).exec(function (err, result) {
        if (result) {
            res.json({
                response: result || {},
                status: 200,
                message: 'Location Added'
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


function getUserByLatLong(lat, long, cb) {
    var lat = parseFloat(lat);
    var long = parseFloat(long);
    var minLat = lat - .1;
    var maxLat = lat + .1;
    var minLong = long - .1;
    var maxLong = long + .1;
    var query = { 'latLong.lat': { $gt: minLat, $lt: maxLat }, 'latLong.long': { $gt: minLong, $lt: maxLong } };
    Location.find(query, { userId: 1, _id: 0 }).exec(function (err, result) {
        if (result) {
            cb(result)
        }
        cb([])

    })

}