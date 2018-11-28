angular.module('myApp')

    .factory('Service', function ($resource) {
        return $resource('service/:id'); // Note the full endpoint address
    })

    .factory('User', function ($resource) {
        return $resource('user/:id', null, {
            'update': { method: 'PUT' },
            'vendorsignup': {
                method: 'POST',
                url: '/xpressItSignUp',
                isArray: false
            },
            'editVendor': {
                method: 'PUT',
                url: '/xpressItUser',
                isArray: false
            },
            'customerList': {
                method: 'GET',
                url: '/getCustomerList',
                isArray: true
            },
            'forgotPassword': {
                method: 'post',
                url: '/xpressItUser/forgotPassword',
                isArray: false
            }
        });
    })
    .factory('ServiceProvider', function ($resource) {
        return $resource('vendor/:id', null, {
            'update': { method: 'PUT' },

            'updateAccountStatus': {
                method: 'POST',
                url: '/updateVendorAccountStatus',
                isArray: false
            },


            'allEmployee': {
                method: 'GET',
                url: '/serviceProvider/getAllEmployees/refToSP:refToSP',
                params: {
                    'refToSP': 'refToSP'
                },
                isArray: true
            },

            'getEmployee': {
                method: 'GET',
                url: '/serviceProvider/employee/empId:empId',
                params: {
                    'empId': 'empId'
                },
                isArray: false
            }

        });
    })
    .factory('Login', function ($resource) {
        return $resource('xpressItLogin/:id'); // Note the full endpoint address
    }).factory('Sales', function ($resource) {
        return $resource('sale/:id'); // Note the full endpoint address
    })
    .factory('Product', function ($resource) {
        return $resource('/product', null, {
            'update': {
                method: 'PUT'
            },

            'delete': {
                method: 'PUT',
                url: '/delete/product',
                isArray: false
            },
            'getVendorProducts': {
                method: 'POST',
                url: '/vendor/product',
                isArray: false
            }
        }); // Note the full endpoint address
    }).factory('Order', function ($resource) {
        return $resource('/adminGetOrders', null, {
            'spAllOrders': {
                method: 'POST',
                url: '/order/getAllUserOrders',
                isArray: true
            },


            'assignEmployeeAnOrder': {
                method: 'PUT',
                url: '/order/assignEmployee',
                isArray: false
            },
            'getCustomerAllOrder': {
                method: 'POST',
                url: '/getCustomerAllOrderList',
                isArray: true
            },
            'allEmployeeOrders': {
                method: 'POST',
                url: '/order/employeeOrders',
                isArray: true
            }
        }); // Note the full endpoint address
    })
    .factory('LoggedInUser', function ($resource) {
        return $resource('LoggedInUserInfo/:id'); // Note the full endpoint address
    })
    .factory('Logout', function ($resource) {
        return $resource('logout/:id'); // Note the full endpoint address
    }).factory('Category', function ($resource) {
        return $resource('/wallmart/category/:id', null, {

            fetchCategoryList: {
                method: 'GET',
                url: '/wallmart/category/',
                isArray: false
            },
            fetchSubCategoryList: {
                method: 'GET',
                url: '/wallmart/subcategory?categoryId=:id',
                isArray: false
            },
        }); // Note the full endpoint address
    })
    .factory('Time', function ($resource) {
        return $resource('time/:id'); // Note the full endpoint address
    })
    .factory("currentTime", function () {
        return {};
    }).factory('Package', function ($resource) {
        return $resource('package/:id', null, {

        });
    }).
    factory('Payment', function ($resource) {
        return $resource('xpressIt/makeUserSubscriptionPayment/:id', null, {

        });
    })

