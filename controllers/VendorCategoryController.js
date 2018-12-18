var VendorCategory = require('../models/VendorCategory');
var VendorItem = require('../models/XpressItVendorItem');
var _ = require('underscore');
module.exports = {
    createCategory: createCategory,
    getCategory: getCategory,
    getVendorCategory:getVendorCategory,
}

function createCategory(req, res) {

    var name = req.body.name;

    var categoryEntry = new VendorCategory({
        name: name
    });
    categoryEntry.save(function (err, details) {
        if (err) {
            res.json({
                status: err.status,
                message: err.message
            })

        } else {
            res.json({
                response: details || {},
                status: 200,
                message: 'Category Added'
            });
        }
    })
}


function getCategory(req, res) {
    VendorCategory.find().exec(function (err, document) {
      console.log('err',document);
        if (document && document!=null && document!='null') {
			      console.log('err33',document);

            res.json({
                status: 200,
                message: 'category fetched',
                response: document
            })
        }
        if (err) {
               res.json({
                status: 200,
                message: 'category not found',
                response: {}
            })
        }
    })
};

function getVendorCategory(req, res) {
    
	var vendorId = req.query.vendorId;
	VendorItem.aggregate(
						[  
						{"$match":{"vendorId": vendorId}},
						{"$group": {
						"_id": "$categoryId",
						"categoryId": { "$first": "$categoryId"},
						}},
						{ "$project" : { _id : 0 , categoryId : 1 } }
						],
	function(err,result) 
	{
		if (err) throw err;
		var promiseArr = [];
	    var counter = 1;
		for(var i = 0; i < result.length; i++) 
		{
			var data = result[i];
			VendorCategory.findOne({"_id": new Object(data.categoryId)}).exec(function (err, document) {
			if(document)
			{
				promiseArr.push(document);
				if(counter == result.length - 1) 
				{
					res.json({
					status: 200,
					message: 'category fetched',
					response: promiseArr
					})
				}
				counter++;	
			}
		 })
			
		}
	  }
	)
   };



