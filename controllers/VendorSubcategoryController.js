var VendorSubcategory = require('../models/VendorSubcategory');
var VendorItem = require('../models/XpressItVendorItem');
var _ = require('underscore');
module.exports = {
    createSubcategory: createSubcategory,
    getSubcategory: getSubcategory,
     getVendorSubcategory:getVendorSubcategory,  

}

function createSubcategory(req, res) {

    var name = req.body.name;
    var categoryId = req.body.categoryId;

    var categoryEntry = new VendorSubcategory({
        name: name,
        categoryId: categoryId
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
                message: 'SubCategory Added'
            });
        }
    })
}





function getSubcategory(req, res) {
    var categoryId = req.query.categoryId;
    VendorSubcategory.find({ categoryId: categoryId }).exec(function (err, document) {

        if (document) {
            res.json({
                status: 200,
                message: 'subcategory fetched',
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

function getVendorSubcategory(req, res) 
{
    
	var vendorId = req.query.vendorId;
	VendorItem.aggregate(
						[  
						{"$match":{"vendorId": vendorId}},
						{"$group": {
						"_id": "$subCategoryId",
						"subCategoryId": { "$first": "$subCategoryId"},
						}},
						{ "$project" : { _id : 0 , subCategoryId : 1 } }
						],
	function(err,result) 
	{
		if (err) throw err;
		var promiseArr = [];
	    var counter = 1;
		for(var i = 0; i < result.length; i++) 
		{
			var data = result[i];
			VendorSubcategory.findOne({"_id": new Object(data.subCategoryId)}).exec(function (err, document) {
			if(document)
			{
				promiseArr.push(document);
				if(counter == result.length - 1) 
				{
					res.json({
					status: 200,
					message: 'sub category fetched',
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
