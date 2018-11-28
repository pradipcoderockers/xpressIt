var walmart = require('../WalmartConfig').walmart;
module.exports = {
    getStoresByLatLong: getStoresByLatLong,
}

function getStoresByLatLong(req, res) {
    var long = req.query.long;
    var lat = req.query.lat;
    walmart.stores.byPosition(lat, long).then(function (result) {
        if (result) {
            res.json({
                status: 200,
                message: 'stores fetched',
                response: result
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