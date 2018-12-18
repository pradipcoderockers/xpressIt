/**
 * Module dependencies
 */

var done = false;
var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    fs = require('node-fs'),
    mv = require('mv');

var mongooseConnection = require('./mongooseConnection');
var multer = require('multer');

var walmart = require('./WalmartConfig').walmart;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage })
var mongoose = require('mongoose')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect(mongooseConnection.dbPath);
//Include Controllers Here
var XpressItUserController = require('./controllers/XpressItUserController');
var XpressItAddressController = require('./controllers/XpressItAddressController');
var XpressItCategoryController = require('./controllers/XpressItCategoryController');
var XpressItSubcategoryController = require('./controllers/XpressItSubcategoryController');
var XpressItInnerSubcategoryController = require('./controllers/XpressItInnerSubcategoryController');
var XpressItStoreController = require('./controllers/XpressItStoreController');
var XpressItNotificationController = require('./controllers/NotificationController');
var XpressItBankDetailsController = require('./controllers/XpressItBankDetailsController');
var XpressItItemController = require('./controllers/XpressItItemController');
var XpressItOrdersController = require('./controllers/XpressItOrdersController');
var XpressItTransactionController = require('./controllers/XpressItTransactionController');
var VendorCategoryController = require('./controllers/VendorCategoryController');
var VendorSubcategoryController = require('./controllers/VendorSubcategoryController');
var LocationController = require('./controllers/LocationController');
var ContentController = require('./controllers/ContentController');
var PackageController = require('./controllers/PackageController');

// Constants
var DEFAULT_PORT = mongooseConnection.port;
var PORT = process.env.PORT || DEFAULT_PORT;

// App
var app = express();
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.set("jsonp callback", true);
app.set('jsonp callback name', 'code');
app.use(logger('combined'));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(session({
    secret: 'anything',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());


// //user signup strategy

// passport.use('local-signup', new LocalStrategy({
//         // by default, local strategy uses username and password, we will override with email
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true // allows us to pass back the entire request to the callback
//     },
//     AdminController.adminSignUp
// ));


// //user login strategy
// passport.use('local-login', new LocalStrategy({
//         usernameField: 'email',
//         passReqToCallback: true // allows us to pass back the entire request to the callback
//     },
//     AdminController.adminLogin
// ));



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.json({ "status": "logout" });
});

/**
 * Routes
 */
app.options('*', function(req, res) {
    res.sendStatus(200);
});




app.post('/adminLogin', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess', // redirect to the secure profile section
    failureRedirect: '/loginFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));




app.post('/adminSignUp', passport.authenticate('local-signup', {
    successRedirect: '/signUpSuccess', // redirect to the secure profile section
    failureRedirect: '/signUpFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));



// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
// JSON API
app.get('/api/name', api.name);
app.get('/logout', function(req, res) {
    req.logout();
    res.json({ "status": "logout" });
});

//=====USER API's=======
app.post('/xpressItLogin', XpressItUserController.userLoginMechanism);
app.post('/xpressItSignUp', XpressItUserController.userSignUp);
app.get('/xpressItUser', XpressItUserController.getUserInfo);
app.put('/xpressItUser', XpressItUserController.editUser);
app.post('/xpressItUser/changePassword', XpressItUserController.changePassword);
app.post('/xpressItUser/forgotPassword', XpressItUserController.forgotPassword);
app.post('/xpressItUser/logout', XpressItUserController.logout);
app.post('/xpressItUser/tokenUpdate', XpressItUserController.tokenUpdate);
app.post('/xpressIt/makepayment', XpressItTransactionController.makePayment);
app.post('/xpressIt/makeVendorOrderPayment', XpressItTransactionController.makeVendorOrderPayment);
app.post('/xpressIt/makeUserSubscriptionPayment', XpressItTransactionController.makeUserSubscriptionPayment);
//=======User Address API's

app.get('/xpressItAddress', XpressItAddressController.getAddress);
app.get('/xpressItAddress/userAddresses', XpressItAddressController.getUserAddresses);
app.put('/xpressItAddress', XpressItAddressController.editAddress);
app.post('/xpressItAddress', XpressItAddressController.setAddress);

//=====Category API's=======
app.post('/wallmart/category', XpressItCategoryController.createCategory);
app.get('/wallmart/category', XpressItCategoryController.getCategory);
//=====Subcategory API's=======
app.post('/wallmart/subcategory', XpressItSubcategoryController.createSubcategory);
app.get('/wallmart/subcategory', XpressItSubcategoryController.getSubcategory);

//=====Inner Subcategory API's=======
app.post('/wallmart/innerSubcategory', XpressItInnerSubcategoryController.createInnerSubcategory);
app.get('/wallmart/innerSubcategory', XpressItInnerSubcategoryController.getInnerSubcategory);

//=====Store API's=======
app.get('/wallmart/getStore/latLong', XpressItStoreController.getStoresByLatLong);

//=====Items API's=======
app.get('/wallmart/getItems', XpressItItemController.getVendorProduct);
app.get('/wallmart/searchItem', XpressItItemController.searchItem);

//=====Notification API's======
app.get('/wallmart/notifications', XpressItNotificationController.getNotifications);


//=====bank details API's======
app.get('/wallmart/bankDetails', XpressItBankDetailsController.getBankBankDetails);
app.post('/wallmart/bankDetails', XpressItBankDetailsController.addBankDetails);
app.put('/wallmart/bankDetails', XpressItBankDetailsController.editBankBankDetails);
app.get('/wallmart/bankDetails/userId', XpressItBankDetailsController.getBankBankDetailsByUserId);



//======Order API's======
app.post('/wallmart/order', XpressItOrdersController.setOrder);
app.post('/wallmart/vendororder', XpressItOrdersController.setVendorOrder);
app.get('/wallmart/order', XpressItOrdersController.getOrder);
app.get('/wallmart/order/id', XpressItOrdersController.getOrderByOrderId);
app.put('/wallmart/order', XpressItOrdersController.updateStatus);
app.get('/wallmart/order/current/user', XpressItOrdersController.getCurrentOrderCustomer);
app.get('/wallmart/order/current/deliveryBoy', XpressItOrdersController.getCurrentOrderDeliveryBoy);
app.get('/wallmart/order/history/user', XpressItOrdersController.getHistoryOrderCustomer);
app.get('/wallmart/order/history/deliveryBoy', XpressItOrdersController.getHistoryOrderDeliveryBoy);
app.put('/wallmart/deliveryFees', XpressItOrdersController.updateDeliveryFees);
app.get('/wallmart/deliveryFees', XpressItOrdersController.getDeliveryFees);
app.post('/wallmart/deliveryboy/total', XpressItOrdersController.getDeliveryBoysTotalFees);
app.post('/location', LocationController.setLocation);
app.get('/location', LocationController.getLocationByLatLong);
app.post('/content', ContentController.addContent);
app.get('/content', ContentController.getContent);
app.post('/package', PackageController.addPackage);
app.get('/package', PackageController.getAllPackage);
app.get('/package/:id', PackageController.getPackageById);






app.get('/testpush', XpressItNotificationController.testPush);
app.get('/test', function(req, res) {
    walmart.feeds.bestSellers('91083').then(function(result) {
        res.json(result);
    })

});

app.get('/signUpSuccess', function(req, res) {
    if (req) {
        res.json({
            status: 200,
            message: 'User Created',
            userData: req.user
        });
    }
});

app.get('/signUpFailure', function(req, res) {
    res.json({
        status: 401,
        message: 'User already exists',
        response: {}
    })

});

app.get('/loginSuccess', function(req, res) {

    if (req) {
        res.json({
            status: 200,
            message: 'User Logged In',
            userData: req.user
        });
    }
});

app.get('/loginFailure', function(req, res) {
    res.json({
        status: 401,
        message: 'Invalid Login Credentails',
        response: {}
    })

});



app.post('/uploadImage', upload.single('file'), function(req, res, next) {
    console.log(new Date())
    var d = new Date();
    console.log(req.file)
    var name = d.getTime() + path.extname(req.file.originalname)
    var path2 = 'public/uploads/' + name;
    fs.rename(req.file.path, path2, function(err) {
        if (err) throw err;
        res.send({ "name": name });
    })
});



//web api



app.get('/getCustomerList', XpressItUserController.getCustomerList);
app.post('/getCustomerAllOrderList', XpressItOrdersController.getAllCustomersAllOrders);
app.get('/vendor', XpressItUserController.getVenderList);
app.post('/updateVendorAccountStatus', XpressItUserController.updateVendorAccountStatus);
app.get('/adminGetOrders', XpressItOrdersController.adminGetOrders);
app.get('/vendor/product', XpressItItemController.getVendorProduct);
app.post('/vendor/product/subcategory', XpressItItemController.getVendorProductBySubCategory);
app.put('/delete/product', XpressItItemController.deleteProduct);
app.post('/product', XpressItItemController.addProduct);
app.put('/product', XpressItItemController.editProduct);
app.get('/LoggedInUserInfo', XpressItUserController.getUserLoggedInfo);
app.post('/vendorcategory', VendorCategoryController.createCategory);
app.get('/vendorcategory', VendorCategoryController.getCategory);
app.post('/vendorsubcategory', VendorSubcategoryController.createSubcategory);
app.get('/vendorsubcategory', VendorSubcategoryController.getSubcategory);
app.get('/itembysubcategory', XpressItItemController.getProductBySubcategory)
app.get('/itembytext', XpressItItemController.getProductByText)
app.get('/vendorbylocation', XpressItUserController.vendorByLocation)
app.post('/sale', XpressItOrdersController.getSales)
app.get('/vendorcategorylist', VendorCategoryController.getVendorCategory)
app.get('/vendorsubcategorylist', VendorSubcategoryController.getVendorSubcategory)







app.get('*', routes.index);
app.listen(8080);
console.log('Running on http://localhost:8080');

function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated() && (req.path == "/partials/adminLogin")) {
        res.status(302);
        res.json({ "redirect": "adminPanel" });
    }
    //case if user is not loggedin and is trying to open login or sign up page
    else if (!req.isAuthenticated() && (req.path == "/partials/adminLogin")) {
        next();
    } else if (!req.isAuthenticated() && (req.path == "/partials/adminPanel")) {
        res.status(302);
        res.json({ "redirect": "login" });
    } else if (req.isAuthenticated()) {
        next();
    }


}
