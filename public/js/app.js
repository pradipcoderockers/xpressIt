'use strict';
// Declare app level module which depends on filters, and services

var app = angular.module('myApp', [
    'ngRoute', 'angular.filter', 'ngResource', 'ngFileUpload'
])

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    Stripe.setPublishableKey('pk_test_4Cn4uYxYF3imTkzMnVffYRnO');

    $httpProvider.interceptors.push(function ($q, $location) {
        return {
            'responseError': function (rejection) {
                if (rejection.status == 302) {
                    if (JSON.parse(rejection.data).redirect == 'spAllBids') {
                        $location.path('/spallbids');
                    } else if (JSON.parse(rejection.data).redirect == 'allOrders') {
                        $location.path('/allorders');
                    } else if (JSON.parse(rejection.data).redirect == 'spLogin') {
                        $location.path('/vlogin');
                    }
                }
                return $q.reject(rejection);
            }
        };
    });

    $routeProvider
        .when('/addCategory', {
            templateUrl: 'partials/addCategory',
            controller: 'addCategoryCtrl',
            controllerAs: 'category'
        })
        .when('/addService', {
            templateUrl: 'partials/addService',
            controller: 'addServiceCtrl',
            controllerAs: 'service'
        })
        .when('/vlogin', {
            templateUrl: 'partials/SPlogin',
            controller: 'SPLoginCtrl',
            controllerAs: 'SPLoginCtrl'
        })
        .when('/alogin', {
            templateUrl: 'partials/adminLogin',
            controller: 'adminLoginCtrl',
            controllerAs: 'adminLoginCtrl'
        })
        .when('/vendors', {
            templateUrl: 'partials/serviceProvider',
            controller: 'adminServiceProviderList',
            controllerAs: 'SPCtrl'
        })
        .when('/orders', {
            templateUrl: 'partials/orders',
            controller: 'orderCtrl',
            controllerAs: 'orders'
        })
        .when('/vhome', {
            templateUrl: 'partials/addProduct',
            controller: 'AddProductCtrl',
            controllerAs: 'AddProductCtrl'
        })

        .when('/vsignup', {
            templateUrl: 'partials/vendorSignUp',
            controller: 'vendorSignupCtrl',
            controllerAs: 'vendorCtrl'
        })
        .when('/packagepayment', {
            templateUrl: 'partials/packagePayment',
            controller: 'PackagePaymentCtrl',
            controllerAs: 'PackagePaymentCtrl'
        })
        .when('/evendor', {
            templateUrl: 'partials/editServiceProviderDetails',
            controller: 'editServiceProviderDetails',
            controllerAs: 'ESPCtrl'
        })
        .when('/customerlist', {
            templateUrl: 'partials/customerList',
            controller: 'customerListCtrl',
            controllerAs: 'customerList'
        }).when('/faq', {
            templateUrl: 'partials/faq',
            controller: 'faqCtrl',
            controllerAs: 'faqCtrl'
        }).when('/faqDriver', {
            templateUrl: 'partials/faqDriver',
            controller: 'faqCtrl',
            controllerAs: 'faqCtrl'
        }).when('/sale', {
            templateUrl: 'partials/sales',
            controller: 'saleCtrl',
            controllerAs: 'saleCtrl'
        })
        .when('/', {
             templateUrl: 'partials/adminLogin',
            controller: 'adminLoginCtrl',
            controllerAs: 'adminLoginCtrl'
        })
        .otherwise({
            redirectTo: '/alogin'
        });
    $locationProvider.html5Mode(true);
})
    .run(function ($http, $rootScope, LoggedInUser, Time, currentTime, $location) {


        // Time.get(function(data) {
        //     currentTime.timeNow = new Date(new Date(new Date(new Date(data.currentTime).setHours(0)).setMinutes(0)).setSeconds(0)).toISOString();
        //     currentTime.tomorrow = new Date(new Date(currentTime.timeNow).getTime() + 24 * 60 * 60 * 1000).toISOString();
        //     currentTime.startWeek = new Date(new Date(currentTime.timeNow).getTime() - new Date(currentTime.timeNow).getDay() * 24 * 60 * 60 * 1000).toISOString();
        //     currentTime.endWeek = new Date(new Date(currentTime.timeNow).getTime() + (6 - new Date(currentTime.timeNow).getDay()) * 24 * 60 * 60 * 1000).toISOString();

        //     console.log(currentTime);;
        // }, function(err) {
        //     console.log(err);
        // });
        // LoggedInUser.get(function(data) {
        //     console.log(data);
        //     if (data.refToUser.accountType == 'serviceProvider')
        //         $rootScope.loggedInSP = data._id;
        // }, function(err) {
        //     console.log(err);
        // })


        $rootScope.showHighlightedTab = function (tab) {

            switch (tab) {
                case 'vendors':
                    $rootScope.pageHeading = 'All Restaurant Owners';
                    $rootScope.pageSubheading = '';
                    $rootScope.activeTab = 'vendors';
                    break;
                case 'orders':
                    $rootScope.pageHeading = 'All Orders';
                    $rootScope.pageSubheading = '';
                    $rootScope.activeTab = 'orders';
                    break;

                case 'sporders':
                    $rootScope.pageHeading = 'All Jobs';
                    $rootScope.pageSubheading = 'Click an order for details';
                    $rootScope.activeTab = 'sporders';
                    break;
                case 'serviceproviders':
                    $rootScope.pageHeading = 'Service Providers';
                    $rootScope.pageSubheading = '';
                    $rootScope.activeTab = 'serviceproviders';
                    break;
                case 'registerserviceprovider':
                    $rootScope.pageHeading = 'Add a Service Provider';
                    $rootScope.pageSubheading = 'Fill all details and submit';
                    $rootScope.activeTab = 'registerserviceprovider';
                    break;
                case 'employees':
                    $rootScope.pageHeading = 'All Employees';
                    $rootScope.pageSubheading = 'See and edit employee details';
                    $rootScope.activeTab = 'employees';
                    break;
                case 'vhome':
                    $rootScope.pageHeading = 'Home';
                    $rootScope.pageSubheading = '';
                    $rootScope.activeTab = 'Home';
                    break;
                case 'registeremployee':
                    $rootScope.pageHeading = 'Add Employee';
                    $rootScope.pageSubheading = 'Fill all details and submit';
                    $rootScope.activeTab = 'registeremployee';
                    break;
                case 'editserviceproviderdetails':
                    $rootScope.pageHeading = 'My Account';
                    $rootScope.pageSubheading = 'Edit your profile details';
                    $rootScope.activeTab = 'editserviceproviderdetails';
                    break;
                case 'customerlist':
                    $rootScope.pageHeading = 'Customer List';
                    $rootScope.pageSubheading = 'See customer details';
                    $rootScope.activeTab = 'customerlist';
                    break;
                case 'addservice':
                    $rootScope.pageHeading = 'Add Subcategory';
                    $rootScope.pageSubheading = 'Add New  Subcategory';
                    $rootScope.activeTab = 'Subcategory';
                    break;
                case 'addcategory':
                    $rootScope.pageHeading = 'Add Category';
                    $rootScope.pageSubheading = 'Add New  Category';
                    $rootScope.activeTab = 'Category';
                    break;
                case 'sale':
                    $rootScope.pageHeading = 'Total Sales';
                    $rootScope.pageSubheading = '';
                    $rootScope.activeTab = 'sale';
                    break;
            }
        }
        $rootScope.showHighlightedTab($location.path().replace('/', ''));

    })
    .controller('addCategoryCtrl', addCategoryCtrl)
    .controller('faqCtrl', faqCtrl)
    .controller('editServiceProviderDetails', editServiceProviderDetails)
    .controller('addServiceCtrl', addServiceCtrl)
    .controller('SPLoginCtrl', SPLoginCtrl)
    .controller('adminLoginCtrl', adminLoginCtrl)
    .controller('adminServiceProviderList', adminServiceProviderList)
    .controller('orderCtrl', orderCtrl)
    .controller('vendorSignupCtrl', vendorSignupCtrl)
    .controller('registerEmployeeCtrl', registerEmployeeCtrl)
    .controller('employeeCtrl', employeeCtrl)
    .controller('AddProductCtrl', AddProductCtrl)
    .controller('headerCtrl', headerCtrl)
    .controller('innerHeaderCtrl', innerHeaderCtrl)
    .controller('spAllBidsCtrl', spAllBidsCtrl)
    .controller('customerListCtrl', customerListCtrl)
    .controller('saleCtrl', saleCtrl)
    .controller('homeCtrl', homeCtrl)
    .controller('PackagePaymentCtrl', PackagePaymentCtrl)



function headerCtrl($rootScope) {
    $rootScope.enter = false;
}

function homeCtrl() {

    localStorage.clear();

}

function innerHeaderCtrl(Logout, $location) {
    var innerHeader = this;
    innerHeader.logout = function () {
        Logout.get(function (data) {
            $location.path('/vlogin');
        }, function (err) {
            console.log(err);
        })
    }
}

function faqCtrl($location) {
    var faqCtrl = this;
    faqCtrl.isDriver = $location.search().driver;

}

function saleCtrl(Sales, $location) {
    if (!localStorage.getItem('loggedInAdmin')) {
        $location.path('/');
        return;
    }

    var saleCtrl = this;
    saleCtrl.salesRecords = [];
    saleCtrl.getRecords = function () {
        for (var i = 0; i < 5; i++) {
            Sales.save({
                saleType: i
            }, function (data) {
                saleCtrl.salesRecords.push({ wallmart: data.wallmart, vendor: data.vendor, saleType: i })


            }, function (err) {

            });
        }
    }
    saleCtrl.getSaleType = function (type) {
        var returnValue = '';
        switch (type) {
            case 0:
                returnValue = 'Daily';
                break;
            case 1:
                returnValue = 'Weekly';
                break;
            case 2:
                returnValue = 'Monthly';
                break;
            case 3:
                returnValue = 'Quaterly';
                break;
            case 4:
                returnValue = 'Yearly';
                break;
        }
        return returnValue;
    }
    saleCtrl.getRecords();


}

function addCategoryCtrl($timeout, Category) {
    var category = this;
    category.newCategory = {};
    category.saved = false;

    category.addCategory = function () {
        Category.save({
            category: category.newCategory.category
        }, function (data) {
            //category.newCategory={};
            category.saved = true;


            $timeout(function () {

                category.saved = false;
            }, 2000)

        }, function (err) {
            console.log(err);
            category.error = true;
            $timeout(function () {

                category.error = false;
            }, 2000)
        });
    }
}

function addServiceCtrl($timeout, Category, Service) {
    var service = this;
    service.newService = {};
    service.saved = false;
    Category.query(function (data) {
        service.newService.category = [];
        _.each(data, function (d) {
            service.newService.category.push({ _id: d._id, category: d.category });

        })


    }, function (err) {
        console.log(err);
        $timeout(function () {

        }, 2000)
    })
    service.addServiceType = function () {
        Service.save({
            service: service.newService.service,
            serviceCategoryId: service.newService.category[0]._id
        }, function (data) {
            service.saved = true;


            $timeout(function () {

                service.saved = false;
            }, 2000)

        }, function (err) {
            console.log(err);
            service.error = true;
            $timeout(function () {

                service.error = false;
            }, 2000)
        });
    }
}

function SPLoginCtrl(Login, $location, LoggedInUser, $rootScope, User, $timeout) {


    localStorage.clear();
    var SPLoginCtrl = this;
    SPLoginCtrl.user = {};
    SPLoginCtrl.loginError = false;
    SPLoginCtrl.login = function () {


        var loginPromise = Login.save({
            email: SPLoginCtrl.user.email,
            password: SPLoginCtrl.user.password,
            role: 2
        }, function (loginData) {
            if (loginData.status === 406) {
                SPLoginCtrl.loginError = true;
                SPLoginCtrl.errorMessage = 'Error! Your account has not been verified. Please check your email for the verification letter.';

                $timeout(function () {
                    SPLoginCtrl.loginError = false;
                }, 3000);
            }
            if (loginData.status === 401) {
                SPLoginCtrl.loginError = true;
                SPLoginCtrl.errorMessage = 'Invalid credentails';
                $timeout(function () {
                    SPLoginCtrl.loginError = false;
                }, 3000);
            }
        }, function (err) {
            console.log('invalid ID Password');
            SPLoginCtrl.loginError = true;
            $timeout(function () {
                SPLoginCtrl.loginError = false;
            }, 3000);

        });


        loginPromise['$promise'].then(function (data) {

            if (data.userData.role == 2) {
                $rootScope.loggedInSP = data.userData._id;
                localStorage.setItem('loggedInUser', data.userData._id);
                localStorage.setItem('loggedInUserPackageId', data.userData.packageId);
                if (!data.userData.packagePaymentDone && data.userData.packageId) {
                    localStorage.setItem('loggedInUserPackageId', data.userData.packageId);
                    $location.path('/packagepayment');
                    return;

                }
                $rootScope.showHighlightedTab('vhome');
                $location.path('/vhome');
            }
        })

    }

    SPLoginCtrl.navigate = function (page) {
        $location.path('/' + page);
    }

    SPLoginCtrl.forgotPassword = function () {
        BootstrapDialog.show({
            title: 'Password Recovery',
            message: $('<input type="email" class="form-control" placeholder="Enter Email Id" >'),
            buttons: [{
                label: 'Recover Password',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function (dialogRef) {
                    var emailForForgottenAccount = dialogRef.getModalBody().find('input').val();
                    User.forgotPassword({ email: emailForForgottenAccount }, function (data) {
                        var message;
                        dialogRef.close();
                        if (data.data == "done")
                            message = 'New password has been sent on your email id'
                        else
                            message = 'Not a registered email id'
                        $timeout(function () {
                            BootstrapDialog.show({
                                message: message,
                                cssClass: 'login-dialog'
                            });
                        }, 300);


                    }, function (err) {
                        console.log(err);
                    })
                }
            }]
        });
    };


}

function adminLoginCtrl($location, Login, $rootScope, $timeout, User) {

    localStorage.clear();
    var adminLoginCtrl = this;
    adminLoginCtrl.user = {}
    adminLoginCtrl.loginError = false;
    adminLoginCtrl.login = function () {

        Login.save({
            email: adminLoginCtrl.user.email,
            password: adminLoginCtrl.user.password,
            role: 3
        }, function (data) {
            if (data.status === 401) {
                adminLoginCtrl.loginError = true;
                $timeout(function () {
                    adminLoginCtrl.loginError = false;
                }, 3000);
                return;

            }

            if (!localStorage.setItem('loggedInAdmin', true)) {

                $rootScope.showHighlightedTab('vendors');
                $location.path('/vendors');
                return;
            }
        }, function (err) {

            console.log('Invalid ID Password');
            adminLoginCtrl.loginError = true;
            $timeout(function () {
                adminLoginCtrl.loginError = false;
            }, 3000);

        });

    }

    adminLoginCtrl.forgotPassword = function () {
        BootstrapDialog.show({
            title: 'Password Recovery',
            message: $('<input type="email" class="form-control" placeholder="Enter Email Id" >'),
            buttons: [{
                label: 'Recover Password',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function (dialogRef) {
                    var emailForForgottenAccount = dialogRef.getModalBody().find('input').val();
                    User.forgotPassword({ email: emailForForgottenAccount }, function (data) {
                        var message;
                        dialogRef.close();
                        if (data.data == "done")
                            message = 'New password has been sent on your email id'
                        else
                            message = 'Not a registered email id'
                        $timeout(function () {
                            BootstrapDialog.show({
                                message: message,
                                cssClass: 'login-dialog'
                            });
                        }, 300);


                    }, function (err) {
                        console.log(err);
                    })
                }
            }]
        });
    };


}

function adminServiceProviderList($timeout, ServiceProvider, User, $location) {


    if (!localStorage.getItem('loggedInAdmin')) {
        $location.path('/');
        return;
    }
    var SPCtrl = this;
    SPCtrl.clicked = '';

    SPCtrl.showProviderInfo = false;
    SPCtrl.showProvider = true;
    ServiceProvider.query(function (data) {

        SPCtrl.allServiceProviders = [];

        _.each(data, function (provider) {
            var localProvider = {};
            localProvider.providerId = provider._id;
            localProvider._id = provider._id;
            localProvider.firstName = provider.firstName;
            localProvider.lastName = provider.lastName;
            localProvider.name = provider.firstName + ' ' + provider.lastName;
            localProvider.policy = provider.policy;
            localProvider.email = provider.email;
            localProvider.organisation = provider.organisation;
            localProvider.city = provider.city;
            localProvider.state = provider.state;
            localProvider.street = provider.street;
            localProvider.phone = provider.phone;
            localProvider.disabled = provider.disabled;
            localProvider.latLong = provider.latLong;
            localProvider.zipcode = provider.zipcode;
            localProvider.disabled = provider.disabled;
            localProvider.timing = provider.timing;
            localProvider.policy = provider.policy;

            localProvider.image = provider.image;


            SPCtrl.allServiceProviders.push(localProvider)
        })


    }, function (err) {
        $timeout(function () { }, 2000)
    })

    SPCtrl.openProviderInfo = function (provider) {

        SPCtrl.showProvider = true;
        SPCtrl.clicked = provider.providerId;
        SPCtrl.showProviderInfo = true;
        SPCtrl.veiwProvider = provider;
    }



    SPCtrl.disableEmployee = function (employee) {

        employee.disabled = !employee.disabled;
        ServiceProvider.updateAccountStatus({ userId: employee.providerId, disabled: employee.disabled },
            function (data) {

                console.log(data);
            },
            function (err) {
                console.log(err);
            })
    }


    SPCtrl.submit = function () {


        var promise = SPCtrl.upload(SPCtrl.user.file);
        promise.then(function (data) {

            SPCtrl.user.image = data.name;
        }).then(function () {
            User.vendorsignup(SPCtrl.user, function (data) {

                if (data.error) {
                    BootstrapDialog.show({
                        title: 'Register Service Provider Error',
                        message: data.error
                    });

                } else {

                    SPCtrl.user = {};
                    SPCtrl.submitted = false;

                    BootstrapDialog.show({
                        title: 'Approval Pending',
                        message: 'Account creation request generated. Your account will be activated once the admin aprroves the request'
                    });

                }
            })
        });


    };

    SPCtrl.user = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 2, //PASS accountType as serviceProvider for registering a serviceProvider.
        policy: '',
        city: '',
        zipcode: '',
        city: '',
        street: '',
        state: '',
        organisation: '',
        timing: [{ value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' }
        ],
        image: ''
    };

    SPCtrl.slots = ['12 A.M.', '1 A.M.', '2 A.M.', '3 A.M.', '4 A.M.', '5 A.M.', '6 A.M.', '7 A.M.', '8 A.M.', '9 A.M.', '10 A.M.', '11 A.M.', '12 P.M.', '1 P.M.', '2 P.M.', '3 P.M.', '4 P.M.', '5 P.M.', '6 P.M.', '7 P.M.', '8 P.M.', '9 P.M.', '10 P.M.', '11 P.M.']
    SPCtrl.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    SPCtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImage',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            deferred.resolve(resp.data);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };

    SPCtrl.showEditForm = false;
    SPCtrl.closeEditVendor = function () {

        SPCtrl.showEditForm = false;
    }
    SPCtrl.editVendor = function (provider) {
        SPCtrl.user = provider;
        SPCtrl.showEditForm = true;

    }

    SPCtrl.submit = function () {


        User.editVendor(SPCtrl.user, function (data) {

            if (data.error) {
                BootstrapDialog.show({
                    title: 'Register Service Provider Error',
                    message: data.error
                });

            } else {

                SPCtrl.user = {};
                SPCtrl.submitted = false;

                BootstrapDialog.show({
                    title: 'Approval Pending',
                    message: 'Account creation request generated. Your account will be activated once the admin aprroves the request'
                });

            }
        })


    };


}

function orderCtrl($timeout, Order, $rootScope, $location) {


    if (!localStorage.getItem('loggedInAdmin')) {
        $location.path('/');
        return;
    }
    $rootScope.showHighlightedTab($location.path().replace('/', ''))
    var orders = this;
    orders.clicked = '';
    orders.idSelected = null;
    orders.reverse = true;
    orders.sortBy = function (sortBy) {
        console.log('sortBy')
        orders.reverse = (orders.sortOrderBy === sortBy) ? !orders.reverse : false;
        orders.sortOrderBy = sortBy;
        console.log(orders.reverse)
    }
    orders.sortOrderBy = 'createdAt';
    orders.filterByCategory = 'all';
    orders.filterByServiceDate = 'all';
    orders.filterByStatus = 'all';


    orders.parentCategory = '';
    orders.allOrders = [];

    var limit = 10,
        skip = 0;
    orders.fetchOrders = function () {
        Order.query({ limit: limit, skip: skip, status: orders.filterByStatus }, function (data) {
            skip = skip + data.length;
            _.each(data, function (order) {
                var localOrder = {};
                var localQuestion = [];
                localOrder.createdAt = order.createdAt;
                localOrder.orderId = order._id;
                localOrder.orderNo = order.customerOrderId;
                localOrder.storeNo = order.storeNo;
                localOrder.storeName = order.name;
                localOrder.storeAddress = order.address;
                localOrder.storeCity = order.city;
                localOrder.storeZip = order.zipCode;
                localOrder.storeAddress = order.address;
                localOrder.storePhone = order.phone;
                localOrder.paid = order.paid ? 'Payment Done' : 'Pending';
                localOrder.orderStatus = order.status;
                localOrder.fees = order.fees;
                localOrder.total = order.total;
                localOrder.items = order.items;
                localOrder.status = order.status;
                if (order.status === 0) {
                    localOrder.statusText = 'Placed'
                }
                if (order.status === 1) {
                    localOrder.statusText = 'IN PROGRESS'
                }
                if (order.status === 2) {
                    localOrder.statusText = 'DELVIERED'
                }




                orders.allOrders.push(localOrder);
            })
        }, function (err) {
            $timeout(function () { }, 2000)
        })
    }
    orders.fetchOrders();

    orders.showInfo = false;
    orders.showOrder = true;

    orders.openOrder = function (order) {

        orders.showOrder = true;
        orders.clicked = order.orderId;
        orders.showInfo = true;
        orders.veiwOrder = order;
        orders.idSelected = order.orderId;
    }



}

function vendorSignupCtrl(Upload, User, $timeout, $q, Package, Payment) {

    localStorage.clear();
    var vendorCtrl = this;
    vendorCtrl.showLATLONG = true;

    vendorCtrl.getToken = function () {
        vendorCtrl.cardError = 'Loading...';


        Stripe.card.createToken({
            number: vendorCtrl.payment.cardNumber,
            exp_month: vendorCtrl.payment.expiryMonth,
            exp_year: vendorCtrl.payment.expiryYear,
            cvc: vendorCtrl.payment.cvc
        }, (status, response) => {

            // Wrapping inside the Angular zone
            //   vendorCtrl._zone.run(() => {
            if (status === 200) {

                Payment.save(
                    {
                        stripeToken: response.id,
                        amount: 10,
                        userId: "5b1a840a22b6cf5d562723cd"
                    },
                    function (data) {
                        console.log(data);
                    })
                vendorCtrl.cardError = `Success! Card token ${response.card.id}.`;
            } else {
                vendorCtrl.cardError = response.error.message;
            }
            //   });
        });
    }
    Package.get({}, function (data) {
        vendorCtrl.packageList = data.response;
        console.log(vendorCtrl.packageList);
    })


    vendorCtrl.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition);
        } else {
            BootstrapDialog.show({
                title: 'Error',
                message: 'Geolocation is not supported in the browser'
            });
        }
    }
    vendorCtrl.show = true;
    function setPosition(pos) {
        vendorCtrl.user.latLong.lat = pos.coords.latitude;
        vendorCtrl.user.latLong.long = pos.coords.longitude;
        vendorCtrl.show = false;
        $timeout(function () {
            vendorCtrl.show = true;

        }, 100)

    }

    vendorCtrl.submit = function () {


        var promise = vendorCtrl.upload(vendorCtrl.user.file);
        promise.then(function (data) {

            vendorCtrl.user.image = 'uploads/' + data.name;
        }).then(function () {
            vendorCtrl.user.packageId = 1;
            User.vendorsignup(vendorCtrl.user, function (data) {

                if (data.error) {
                    BootstrapDialog.show({
                        title: 'Register Service Provider Error',
                        message: data.error
                    });

                } else {

                    vendorCtrl.user = {};
                    vendorCtrl.submitted = false;

                    BootstrapDialog.show({
                        title: 'Approval Pending',
                        message: 'Account creation request generated. Your account will be activated once the admin aprroves the request'
                    });

                }
            }, function (err) {
                console.log(err);
                BootstrapDialog.show({
                    title: 'Error',
                    message: 'User Already exists'
                });
            })
        });


    };

    vendorCtrl.user = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 2, //PASS accountType as serviceProvider for registering a serviceProvider.
        policy: '',
        city: '',
        zipcode: '',
        city: '',
        street: '',
        state: '',
        organisation: '',
        latLong: {},
        package: {},
        timing: [{ value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' },
        { value: false, startTime: '', endTime: '' }
        ],
        image: ''
    };

    vendorCtrl.slots = ['12 A.M.', '1 A.M.', '2 A.M.', '3 A.M.', '4 A.M.', '5 A.M.', '6 A.M.', '7 A.M.', '8 A.M.', '9 A.M.', '10 A.M.', '11 A.M.', '12 P.M.', '1 P.M.', '2 P.M.', '3 P.M.', '4 P.M.', '5 P.M.', '6 P.M.', '7 P.M.', '8 P.M.', '9 P.M.', '10 P.M.', '11 P.M.']
    vendorCtrl.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    vendorCtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImage',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            deferred.resolve(resp.data);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };


}


function PackagePaymentCtrl(Package, Payment, $timeout,$rootScope,$location) {

    var PackagePaymentCtrl = this;
    $timeout(function () {
        PackagePaymentCtrl.showError = false;

    }, 10);
    PackagePaymentCtrl.getToken = function () {
        PackagePaymentCtrl.cardError = 'Loading...';


        Stripe.card.createToken({
            number: PackagePaymentCtrl.payment.cardNumber,
            exp_month: PackagePaymentCtrl.payment.expiryMonth,
            exp_year: PackagePaymentCtrl.payment.expiryYear,
            cvc: PackagePaymentCtrl.payment.cvc
        }, (status, response) => {

            // Wrapping inside the Angular zone
            //   vendorCtrl._zone.run(() => {
            if (status === 200) {

                Payment.save(
                    {
                        stripeToken: response.id,
                        amount: PackagePaymentCtrl.userPackage.price,
                        userId: localStorage.getItem('loggedInUser')
                    },
                    function (data) {
                        $timeout(function () {
                            PackagePaymentCtrl.showError = true;

                            PackagePaymentCtrl.cardError = `Payment Successful`;
                        }, 10);
                        $timeout(function () {
                            $rootScope.showHighlightedTab('vhome');
                            $location.path('/vhome');
                        }, 10);


                    })
            } else {

                $timeout(function () {
                    PackagePaymentCtrl.showError = true;

                    PackagePaymentCtrl.cardError = response.error.message;
                }, 10);
            }
            //   });
        });
    }
    Package.get({}, function (data) {

        var packageId = localStorage.getItem('loggedInUserPackageId');
        PackagePaymentCtrl.userPackage = _.find(data.response, function (pack) {
            return pack._id == packageId;
        })

    })




}

function registerEmployeeCtrl(Upload, Category, $rootScope, User, ServiceProvider, $timeout, $q) {

    var RECtrl = this;
    RECtrl.submit = function () {


        RECtrl.user.serviceProviderId = $rootScope.loggedInSP;


        if (RECtrl.file) {
            if (RECtrl.user.refToServiceType.length == 0 || !RECtrl.user.refToServiceType) {
                RECtrl.categoryRequired = true;
            } else {
                RECtrl.categoryRequired = false;
                RECtrl.fileRequired = false;
                var promise = RECtrl.upload(RECtrl.file);
                promise.then(function (data) {
                    RECtrl.user.imageURL = data;
                }).then(function () {

                    User.registerServiceProviderAndEmployee({

                        user: RECtrl.user
                    }, function (data) {

                        if (data.error) {
                            BootstrapDialog.show({
                                title: 'Register Employee Error',
                                message: data.error
                            });

                        } else {

                            RECtrl.user = {};
                            RECtrl.submitted = false;
                            console.log(data);

                            BootstrapDialog.show({
                                title: 'Register Employee',
                                message: 'Employee Registered'
                            });

                        }
                    })

                })
            }
        } else {
            RECtrl.fileRequired = true;
            // $timeout(function () {
            //     RECtrl.fileRequired = false;
            // }, 3000)

        }


    };


    Category.query(function (data) {
        RECtrl.category = [];
        _.each(data, function (d) {
            var service = [];
            _.each(d.service, function (ser) {


                service.push({ serviceId: ser.serviceId, serviceType: ser.serviceType, checkBoxVal: false });

            })


            RECtrl.category.push({ categoryId: d.categoryId, category: d.category, services: service });

        })


    }, function (err) {
        console.log(err);
        $timeout(function () {

        }, 2000)
    })

    RECtrl.user = {
        firstName: '',
        lastName: '',
        organization_name: '',
        photo: '',
        email: '',
        phoneNumber: '',
        password: '',
        accountType: 'employee', //PASS accountType as serviceProvider for registering a serviceProvider.
        refToServiceType: [],
        description: ''
    };

    RECtrl.addServiceType = function (service) {
        if (service.checkBoxVal) {
            RECtrl.user.refToServiceType.push(service.serviceId);
        } else {
            RECtrl.user.refToServiceType = _.reject(RECtrl.user.refToServiceType, function (ser) {
                return ser == service.serviceId;
            })
        }
    }


    // upload on file select or drop
    RECtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImageBackend',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            RECtrl.file = null;
            deferred.resolve(resp.data);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };


}

function employeeCtrl($timeout, ServiceProvider, $rootScope, Category, Upload, User, Order, $q) {

    var empCtrl = this;
    empCtrl.showHistoryDetail = false;
    empCtrl.employeeDetails = true;
    empCtrl.showHistory = false;
    empCtrl.toggle = function () {
        empCtrl.employeeDetails = !empCtrl.employeeDetails;
        empCtrl.showHistory = !empCtrl.showHistory;

    }
    empCtrl.showProviderInfo = false;
    empCtrl.showEditForm = false;
    // console.log($rootScope.loggedInSP);
    ServiceProvider.allEmployee({ refToSP: $rootScope.loggedInSP }, function (data) {
        empCtrl.allEmployees = [];

        console.log(data);
        _.each(data, function (provider) {
            console.log(provider)
            var localProvider = {};
            localProvider.employeeId = provider._id;
            localProvider.name = provider.firstName + ' ' + provider.lastName;
            localProvider.description = provider.description;
            // localProvider.photo = provider.refToUser._id;
            localProvider.totalRating = provider.refToRating.NumberOfRating;
            localProvider.averageRating = provider.refToRating.AverageRating;
            localProvider.accountActive = provider.accountActive;
            localProvider.imageURL = provider.imageURL;

            var localServiceOffered = [];
            _.each(provider.refToServiceType, function (service) {

                if (provider.refToServiceMenu.refToItem.length != 0)
                //localProvider.menuItem=provider.refToServiceMenu.refToItem;
                {
                    _.each(provider.refToServiceMenu.refToItem, function (item) {
                        if (service._id == item.serviceTypeId)
                            localServiceOffered.push({
                                "serviceTypeId": service._id,
                                "serviceType": service.serviceType,
                                "menu": { "priceEstimate": item.priceEstimate, "title": item.title }
                            })
                    })
                } else {

                    localServiceOffered.push({ "serviceTypeId": service._id, "serviceType": service.serviceType })
                }

            })
            localProvider.serviceOffered = localServiceOffered;
            empCtrl.allEmployees.push(localProvider)
        })


    }, function (err) {
        $timeout(function () { }, 2000)
    })

    empCtrl.openProviderInfo = function (provider) {
        empCtrl.showProviderInfo = true;
        empCtrl.showEditForm = false;
        empCtrl.showHistoryDetail = false;
        empCtrl.employeeDetails = true;
        empCtrl.showHistory = false;
        empCtrl.veiwProvider = provider;
        ServiceProvider.getEmployee({ empId: provider.employeeId }, function (data) {
            console.log(data);
            empCtrl.user = {
                userId: data.refToUser._id,
                serviceProviderId: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                organization_name: data.organization_name,
                photo: '',
                email: data.refToUser.email,
                phoneNumber: data.refToUser.phoneNumber,
                imageURL: data.imageURL,
                //password: '',
                accountType: 'serviceProvider', //PASS accountType as serviceProvider for registering a serviceProvider.
                refToServiceType: data.refToServiceType,
                description: data.description
            };


            _.each(empCtrl.category, function (cat) {
                _.each(cat.services, function (service) {
                    _.each(empCtrl.user.refToServiceType, function (serviceType) {
                        if (serviceType == service.serviceId)
                            service.checkBoxVal = true;

                    })

                })

            })
            console.log(empCtrl.user)
        }, function (err) {
            console.log(err);
        })
    }


    empCtrl.disableEmployee = function (employee) {
        employee.accountActive = !employee.accountActive
        ServiceProvider.updateAccountStatus({ refToSP: employee.employeeId, disable: employee.accountActive },
            function (data) {

                console.log(data);
            },
            function (err) {
                console.log(err);
            })
    }

    Category.query(function (category) {
        empCtrl.category = [];

        _.each(category, function (d) {
            var service = [];
            _.each(d.service, function (ser) {
                service.push({ serviceId: ser.serviceId, serviceType: ser.serviceType, checkBoxVal: false });
            })
            empCtrl.category.push({ categoryId: d.categoryId, category: d.category, services: service });

        })

    }, function (err) {
        console.log(err);
        $timeout(function () {

        }, 2000)
    })


    function saveDetails() {

        User.editServiceProviderAndEmployee({

            user: empCtrl.user
        }, function (data) {
            console.log(data);

            BootstrapDialog.show({
                title: 'Edit Account',
                message: 'Changes saved'
            });

        })
    }

    empCtrl.submit = function () {
        if (empCtrl.file) {
            var promise = empCtrl.upload(empCtrl.file);
            promise.then(function (data) {
                empCtrl.user.imageURL = data;
            }).then(function () {
                saveDetails();
            })
        } else {
            saveDetails()
        }


    };

    empCtrl.workHistory = function (employee) {
        empCtrl.employeeAllOrder = [];

        Order.allEmployeeOrders({ employeeId: employee.employeeId }, function (employeeOrders) {
            console.log(employeeOrders)

            _.each(employeeOrders, function (order) {
                var localOrder = {};
                if (order.refToServiceType.refToServiceCategory == '579735918c70e9cc338be339') {
                    localOrder.serviceCategory = 'Moving';
                } else if (order.refToServiceType.refToServiceCategory == '57974a17de6c152c3a191dee') {
                    localOrder.serviceCategory = 'Cleaning';
                } else {
                    localOrder.serviceCategory = 'Handyman';
                }
                localOrder.serviceType = order.refToServiceType.serviceType;
                localOrder.serviceDate = order.serviceDate;
                localOrder.serviceTimeSlot = order.serviceTimeSlot;
                localOrder.orderRating = order.orderRating;
                localOrder.customerFeedback = order.customerFeedback;
                localOrder.orderNo = order.orderNo;
                localOrder.employeeStartTime = order.employeeStartTime;
                localOrder.employeeStartEndTime = order.employeeStartEndTime;
                localOrder.employeeStartLocationLat = order.employeeStartLocationLat;
                localOrder.employeeStartLocationLong = order.employeeStartLocationLong;
                localOrder.employeeStartLocationEndLat = order.employeeStartLocationEndLat;
                localOrder.employeeStartLocationEndLong = order.employeeStartLocationEndLong;
                empCtrl.employeeAllOrder.push(localOrder);

            })
        }, function (err) {
            console.log(err)
        });
    }


    empCtrl.addServiceType = function (service) {
        if (service.checkBoxVal) {
            empCtrl.user.refToServiceType.push(service.serviceId);
        } else {
            empCtrl.user.refToServiceType = _.reject(empCtrl.user.refToServiceType, function (ser) {
                return ser == service.serviceId;
            })
        }
    }


    // upload on file select or drop
    empCtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImageBackend',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            empCtrl.file = null;
            deferred.resolve(resp.data);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };


}

function AddProductCtrl($timeout, Upload, Product, Service, $rootScope, $location, $window, $q, Category) {

    if (!localStorage.getItem('loggedInUser')) {
        $location.path('/');
        return;
    }
    var AddProductCtrl = this;
    AddProductCtrl.showEditForm = false;
    AddProductCtrl.itemData = { category: '', subcategory: '', name: '', price: '', description: '', image: '' };
    AddProductCtrl.items = [];
    AddProductCtrl.showEdit = false;

    AddProductCtrl.addMoreProduct = function () {
        AddProductCtrl.itemData.vendorId =
            localStorage.getItem('loggedInUser');
        var promise = AddProductCtrl.upload(AddProductCtrl.itemData.file);
        promise.then(function (data) {

            AddProductCtrl.itemData.image = 'uploads/' + data.name;
        }).then(function () {

            Product.save(
                AddProductCtrl.itemData,
                function (data) {
                    console.log(data);
                    AddProductCtrl.items.push(data.response);
                    AddProductCtrl.itemData = { category: '', name: '', price: '', description: '', image: '' };
                    AddProductCtrl.submitted = false;


                    BootstrapDialog.show({
                        title: 'Success',
                        message: 'Product Added'
                    });
                },
                function (err) {

                    BootstrapDialog.show({
                        title: 'Error',
                        message: 'Product not saved'
                    });


                });
        })

    }

    AddProductCtrl.removeProduct = function (itemToBeDeleted) {

        Product.delete({ productId: itemToBeDeleted._id },
            function (data) {
                AddProductCtrl.items = _.reject(AddProductCtrl.items, function (item) {
                    return item._id === itemToBeDeleted._id
                })
            },
            function (err) {



            });

    }
    AddProductCtrl.scrollToTop = function (item) {
        AddProductCtrl.showEditForm = true;
        AddProductCtrl.editItemData = angular.copy(item);
        AddProductCtrl.editItemData.category = AddProductCtrl.getCategory(item.categoryId);
        AddProductCtrl.getSubcategory(item.categoryId, callback);
        function callback() {
            AddProductCtrl.editItemData.subcategory = _.find(AddProductCtrl.subCategoryListing, function (prod) {
                return prod.subCategoryId == item.subcategoryId;
            })
        }
        $window.scrollTo(0, 0);

    }

    AddProductCtrl.discard = function () {
        AddProductCtrl.editItemData = { category: '', name: '', price: '', description: '' };
        $window.scrollTo(0, 0);

    }
    AddProductCtrl.editProduct = function () {

        var promise = AddProductCtrl.upload(AddProductCtrl.editItemData.file);
        promise.then(function (data) {

            AddProductCtrl.editItemData.imageLink = data.name;
        }).then(function () {

            Product.update(
                AddProductCtrl.editItemData,
                function (data) {
                    AddProductCtrl.items = AddProductCtrl.items.map(function (item) {

                        if (item._id === data.response._id) {
                            item = data.response;
                        }
                        return item;
                    });
                    BootstrapDialog.show({
                        title: 'Success',
                        message: 'Changes saved'
                    });

                },
                function (err) {
                    BootstrapDialog.show({
                        title: 'Error',
                        message: 'Changes not done'
                    });
                });
        })
    }

    AddProductCtrl.getProducts = function (item) {
        Product.getVendorProducts({
            vendorId: localStorage.getItem('loggedInUser')
        },
            function (data) {

                AddProductCtrl.items = data.response;
                console.log(AddProductCtrl.items)
            },
            function (err) {
                console.log(err);

            });
    }
    AddProductCtrl.categoryListing = [];
    AddProductCtrl.subCategoryListing = [];
    AddProductCtrl.getCategory = function () {
        Category.fetchCategoryList(
            function (data) {
                AddProductCtrl.categoryListing = data.response;
                AddProductCtrl.categoryListing.unshift({ path: 'Select Category' })
                AddProductCtrl.itemData.category = { path: 'Select Category' };
            },
            function (err) {
                console.log(err)
            });
    }

    AddProductCtrl.getSubcategory = function (categoryId, cb = null) {
        Category.fetchSubCategoryList({ id: categoryId },
            function (data) {
                AddProductCtrl.subCategoryListing = data.response;
                if (cb) { cb() }
            },
            function (err) {
                console.log(err)
            });

    }
    AddProductCtrl.getCategory();
    AddProductCtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImage',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            deferred.resolve(resp.data);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };
    AddProductCtrl.getProducts();
    AddProductCtrl.getCategoryName = function (categoryId) {
        return _.find(AddProductCtrl.categoryListing, function (prod) {
            return prod.categoryId == categoryId;
        }).path
    }

    AddProductCtrl.getCategory = function (categoryId) {
        return _.find(AddProductCtrl.categoryListing, function (prod) {
            return prod.categoryId == categoryId;
        })
    }


}

function spAllBidsCtrl(Bid, $rootScope, $timeout, $location) {
    var spAllBids = this;
    spAllBids.spAllBids = [];
    spAllBids.clicked = '';
    var limit = 10;
    var skip = 0;

    spAllBids.fetchMoreBids = function () {

        Bid.allServiceProviderBids({
            'serviceProviderId': $rootScope.loggedInSP,
            limit: limit,
            skip: skip
        }, function (data) {
            skip = skip + data.length;
            _.each(data, function (bid) {
                var localOrder = {};
                var localQuestion = [];
                localOrder.bidId = bid._id;
                localOrder.bidding = bid.bidding;
                if (typeof bid.bidding == 'undefined')
                    localOrder.show = true;
                else
                    localOrder.show = false;
                localOrder.orderId = bid.refToOrder._id;
                localOrder.orderNo = bid.refToOrder.orderNo;

                localOrder.serviceType = bid.refToOrder.refToServiceType.serviceType;
                localOrder.serviceTypeId = bid.refToOrder.refToServiceType._id;
                localOrder.bidding = bid.refToOrder.estimateCost;
                if (bid.refToOrder.refToServiceType.refToServiceCategory == '579735918c70e9cc338be339') {
                    localOrder.serviceCategory = 'Moving';
                } else if (bid.refToOrder.refToServiceType.refToServiceCategory == '57974a17de6c152c3a191dee') {
                    localOrder.serviceCategory = 'Cleaning';
                } else {
                    localOrder.serviceCategory = 'Handyman';
                }
                _.each(bid.refToOrder.refToServiceType.refToQuestionnaire.refToQuestion, function (ques) {
                    var localAnswer = [];
                    _.each(ques.refToAnswer, function (ans) {
                        _.each(bid.refToOrder.answerToQuestion, function (useranswer) {
                            if (ans._id.toString() == useranswer.toString()) {
                                localAnswer.push({ 'answerId': ans._id, 'answer': ans.choice });
                            }
                        })
                    })
                    localQuestion.push({ "questionId": ques._id, "question": ques.question, "answer": localAnswer })
                })
                localOrder.questions = localQuestion;
                localOrder.customerName = bid.refToOrder.refToUser.firstName;
                localOrder.customerId = bid.refToOrder.refToUser._id;
                localOrder.customerEmail = bid.refToOrder.refToUser.email;
                localOrder.customerPhoneNumber = bid.refToOrder.refToUser.phoneNumber;
                localOrder.bookingTime = bid.refToOrder.createdAt;
                localOrder.serviceTime = bid.refToOrder.serviceTimeSlot;
                localOrder.serviceDate = bid.refToOrder.serviceDate;
                localOrder.orderDescription = bid.refToOrder.orderDescription;
                localOrder.orderId = bid.refToOrder._id;
                localOrder.status = bid.refToOrder.status;
                localOrder.serviceProviderId = bid.refToServiceProvider;
                spAllBids.spAllBids.push(localOrder);
            })

        }, function (err) {
            console.log(err);
        })
    }

    var timeout = 0;
    if (typeof $rootScope.loggedInSP == 'undefined') {
        timeout = 2000;
    }
    $timeout(function () {

        spAllBids.fetchMoreBids();
    }, 2000)

    spAllBids.openBid = function (bid) {

        spAllBids.clicked = bid.bidId;
        spAllBids.showInfo = true;
        spAllBids.veiwOrder = bid;
    }


    spAllBids.applyBid = function (bidding, bidId, orderId, serviceProviderId, customerId) {
        Bid.applyBid({
            bidId: bidId,
            bidding: bidding,
            orderId: orderId,
            serviceProviderId: serviceProviderId,
            customerId: customerId
        }, function (data) {

            $timeout(function () {
                $rootScope.openThisOrder = orderId;
                $location.path('/sporders')
            })
        })
    }
}

function editServiceProviderDetails(Upload, Category, User, ServiceProvider, $timeout, LoggedInUser, $q) {

    var ESPCtrl = this;
    ESPCtrl.category = [];
    Category.query(function (category) {


        _.each(category, function (d) {
            var service = [];
            _.each(d.service, function (ser) {
                service.push({ serviceId: ser.serviceId, serviceType: ser.serviceType, checkBoxVal: false });
            })
            ESPCtrl.category.push({ categoryId: d.categoryId, category: d.category, services: service });

        })


        LoggedInUser.get(function (data) {
            ESPCtrl.user = {
                userId: data.refToUser._id,
                serviceProviderId: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                organization_name: data.organization_name,
                photo: '',
                email: data.refToUser.email,
                phoneNumber: data.refToUser.phoneNumber,
                //password: '',
                accountType: 'serviceProvider', //PASS accountType as serviceProvider for registering a serviceProvider.
                refToServiceType: data.refToServiceType,
                description: data.description,
                imageURL: data.imageURL
            };


            _.each(ESPCtrl.category, function (cat) {
                _.each(cat.services, function (service) {
                    _.each(ESPCtrl.user.refToServiceType, function (serviceType) {
                        if (serviceType == service.serviceId)
                            service.checkBoxVal = true;

                    })

                })

            })
            console.log(ESPCtrl.user)

        }, function (err) {
            console.log(err);
        })


    }, function (err) {
        console.log(err);
        $timeout(function () {

        }, 2000)
    })

    function saveDetails() {

        User.editServiceProviderAndEmployee({

            user: ESPCtrl.user
        }, function (data) {
            console.log(data);

            BootstrapDialog.show({
                title: 'Edit Account',
                message: 'Changes saved'
            });

        })
    }


    ESPCtrl.submit = function () {

        if (ESPCtrl.file) {
            var promise = ESPCtrl.upload(ESPCtrl.file);
            promise.then(function (data) {
                ESPCtrl.user.imageURL = data;
            }).then(function () {

                saveDetails();
            })
        } else {
            saveDetails();
        }


    };


    ESPCtrl.addServiceType = function (service) {
        if (service.checkBoxVal) {
            ESPCtrl.user.refToServiceType.push(service.serviceId);
        } else {
            ESPCtrl.user.refToServiceType = _.reject(ESPCtrl.user.refToServiceType, function (ser) {
                return ser == service.serviceId;
            })
        }
    }


    // upload on file select or drop
    ESPCtrl.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: 'uploadImageBackend',
            data: { file: file }
        }).then(function (resp) {
            console.log(resp);
            deferred.resolve(resp.data);
            ESPCtrl.file = null;
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };


}

function customerListCtrl($timeout, User, Order, $location) {

    if (!localStorage.getItem('loggedInAdmin')) {
        $location.path('/');
        return;
    }
    var customerList = this;
    customerList.clicked = '';

    customerList.showProviderInfo = false;
    customerList.showProvider = true;
    User.customerList(function (data) {
        console.log(data);

        customerList.allCustomerList = [];

        _.each(data, function (customer) {
            var localCustomer = {};
            localCustomer.customerId = customer._id;
            localCustomer.name = customer.firstName + ' ' + customer.lastName;
            localCustomer.phoneNumber = customer.phone;
            localCustomer.email = customer.email;
            localCustomer.joinedOn = customer.createdAt;
            localCustomer.city = customer.city;
            localCustomer.street = customer.street;
            localCustomer.state = customer.state;
            localCustomer.image = customer.image;
            localCustomer.zipcode = customer.zipcode;

            customerList.allCustomerList.push(localCustomer);


        })




    }, function (err) {
        $timeout(function () { }, 2000)
    })

    customerList.openCustomerOrderHistory = function (customer) {
        customerList.showProvider = true;
        customerList.clicked = customer.customerId;
        customerList.showProviderInfo = true;
        Order.getCustomerAllOrder({ userId: customer.customerId }, function (allOrders) {

            allOrders = [{
                "createdAt": "2018-06-22T09:46:59.273Z",
                "userId": "5b1f6fd4a6724d408d747e46",
                "customerOrderId": "UserOrder102",
                "addressId": "5b1f7190a6724d408d747e58",
                "lat": "-117.374193",
                "long": "34.122765",
                "storeNo": 3131,
                "storeNo": "Rialto Walmart Neighborhood Market",
                "address": "300 West Baseline Rd",
                "city": "Rialto",
                "zipCode": "92376",
                "phone": "(909) 546-3019",
                "stateProvocode": "CA",
                "country": "US",
                "__v": 0,
                "paid": true,
                "status": 0,
                "total": "26.62",
                "fees": "20",
                "items": [{ "itemId": "38683254", "name": "PNY T4400mAh Black Universal Power Pack (1A Output)", "salePrice": 13.31, "qty": "2", "item_image": "https://i5.walmartimages.com/asr/7d5c4de0-a99b-4e8b-8507-6e9d916b8be3_1.2b0ead361305dc08f4cd0681e3498167.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "_id": "5b2cc59309a28e3de681d075" }]
            }, { "_id": "5b2cc6ce09a28e3de681d084", "updatedAt": "2018-06-22T09:52:14.322Z", "createdAt": "2018-06-22T09:52:14.322Z", "long": "-110.953398", "address": "1260 East Tucson Marketplace Blvd", "addressId": "5b2cc6cc09a28e3de681d083", "city": "Tucson", "country": "US", "lat": "32.185694", "name": "Tucson Supercenter", "phone": "520-917-0108", "stateProvocode": "AZ", "storeNo": 5626, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85713", "customerOrderId": "1", "__v": 0, "paid": true, "status": 0, "total": "19.99", "fees": "20", "items": [{ "itemId": "157784785", "item_image": "https://i5.walmartimages.com/asr/a4fd98c9-76ff-4a10-99ec-4c907a12b063_1.8da3be5968386d005162c0f55cf41a28.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "H2O Wireless 3-in-1 SIM Card with First Month Included: $30 Plan H20 Micro & Standard Size", "qty": "1", "salePrice": 19.99, "_id": "5b2cc6ce09a28e3de681d085" }] }, { "_id": "5b2cc71209a28e3de681d094", "updatedAt": "2018-06-22T09:53:22.423Z", "createdAt": "2018-06-22T09:53:22.423Z", "long": "-110.953398", "address": "1260 East Tucson Marketplace Blvd", "addressId": "5b2cc71109a28e3de681d093", "city": "Tucson", "country": "US", "lat": "32.185694", "name": "Tucson Supercenter", "phone": "520-917-0108", "stateProvocode": "AZ", "storeNo": 5626, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85713", "customerOrderId": "2", "__v": 0, "paid": true, "status": 0, "total": "302.08", "fees": "20", "items": [{ "itemId": "42104294", "item_image": "https://i5.walmartimages.com/asr/dcc5ea36-7cf5-4fd5-8b8d-6a56dde46819_1.b240d6f6a09c293d88df511fe4717fd0.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Refurbished Verizon Preapid Apple iPhone 6 16GB, Space Gray", "qty": "1", "salePrice": 302.08, "_id": "5b2cc71209a28e3de681d095" }] }, { "_id": "5b2cc74309a28e3de681d0a4", "updatedAt": "2018-06-22T09:54:11.719Z", "createdAt": "2018-06-22T09:54:11.719Z", "long": "-110.953398", "address": "1260 East Tucson Marketplace Blvd", "addressId": "5b2cc74209a28e3de681d0a3", "city": "Tucson", "country": "US", "lat": "32.185694", "name": "Tucson Supercenter", "phone": "520-917-0108", "stateProvocode": "AZ", "storeNo": 5626, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85713", "customerOrderId": "3", "__v": 0, "paid": true, "status": 0, "total": "11.88", "fees": "20", "items": [{ "itemId": "10316867", "item_image": "https://i5.walmartimages.com/asr/f63dd458-54f7-4b82-bc50-31c3e0c490a2_1.a8d5543a51d6cffa712acc8426096234.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Spring Valley Odorless Garlic Softgels, 1000 mg, 100 Ct, 2 Pk", "qty": "2", "salePrice": 5.94, "_id": "5b2cc74309a28e3de681d0a5" }] }, { "_id": "5b2cc76009a28e3de681d0b4", "updatedAt": "2018-06-22T09:54:40.473Z", "createdAt": "2018-06-22T09:54:40.473Z", "long": "-110.953398", "address": "1260 East Tucson Marketplace Blvd", "addressId": "5b2cc75f09a28e3de681d0b3", "city": "Tucson", "country": "US", "lat": "32.185694", "name": "Tucson Supercenter", "phone": "520-917-0108", "stateProvocode": "AZ", "storeNo": 5626, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85713", "customerOrderId": "4", "__v": 0, "paid": true, "status": 0, "total": "18.95", "fees": "20", "items": [{ "itemId": "36171350", "item_image": "https://i5.walmartimages.com/asr/1065d9b1-ee8b-4921-aaa8-d0335c349d7d_1.21c97ec54293b6c6baa86d580a729ce8.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "VTech DM111, Digital Audio Baby Monitor, DECT 6.0, Belt Clip", "qty": "1", "salePrice": 18.95, "_id": "5b2cc76009a28e3de681d0b5" }] }, { "_id": "5b2cc8d109a28e3de681d0c3", "updatedAt": "2018-06-22T10:00:49.492Z", "createdAt": "2018-06-22T10:00:49.492Z", "userId": "5b1f6fd4a6724d408d747e46", "customerOrderId": "5", "addressId": "5b1f7190a6724d408d747e58", "lat": "-117.374193", "long": "34.122765", "storeNo": 3131, "name": "Rialto Walmart Neighborhood Market", "address": "300 West Baseline Rd", "city": "Rialto", "zipCode": "92376", "phone": "(909) 546-3019", "stateProvocode": "CA", "country": "US", "__v": 0, "paid": true, "status": 0, "total": "26.62", "fees": "20", "items": [{ "itemId": "38683254", "name": "PNY T4400mAh Black Universal Power Pack (1A Output)", "salePrice": 13.31, "qty": "2", "item_image": "https://i5.walmartimages.com/asr/7d5c4de0-a99b-4e8b-8507-6e9d916b8be3_1.2b0ead361305dc08f4cd0681e3498167.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "_id": "5b2cc8d109a28e3de681d0c4" }] }, { "_id": "5b2cc8d809a28e3de681d0d2", "updatedAt": "2018-06-22T10:00:56.694Z", "createdAt": "2018-06-22T10:00:56.694Z", "userId": "5b1f6fd4a6724d408d747e46", "customerOrderId": "6", "addressId": "5b1f7190a6724d408d747e58", "lat": "-117.374193", "long": "34.122765", "storeNo": 3131, "name": "Rialto Walmart Neighborhood Market", "address": "300 West Baseline Rd", "city": "Rialto", "zipCode": "92376", "phone": "(909) 546-3019", "stateProvocode": "CA", "country": "US", "__v": 0, "paid": true, "status": 0, "total": "26.62", "fees": "20", "items": [{ "itemId": "38683254", "name": "PNY T4400mAh Black Universal Power Pack (1A Output)", "salePrice": 13.31, "qty": "2", "item_image": "https://i5.walmartimages.com/asr/7d5c4de0-a99b-4e8b-8507-6e9d916b8be3_1.2b0ead361305dc08f4cd0681e3498167.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "_id": "5b2cc8d809a28e3de681d0d3" }] }, { "_id": "5b2cdd2009a28e3de681d104", "updatedAt": "2018-06-22T11:27:28.398Z", "createdAt": "2018-06-22T11:27:28.398Z", "long": "-110.908802", "address": "3925 E Grant Rd", "addressId": "5b2cdd1f09a28e3de681d103", "city": "Tucson", "country": "US", "lat": "32.25197", "name": "Tucson Neighborhood Market", "phone": "520-327-0085", "stateProvocode": "AZ", "storeNo": 3357, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85712", "customerOrderId": "9", "__v": 0, "paid": true, "status": 0, "total": "27.96", "fees": "20", "items": [{ "itemId": "54464720", "item_image": "https://i5.walmartimages.com/asr/db23c82c-9359-468d-a3da-b0d0d9da7915_1.7609b0bce848a9fcf086506a8b3428ab.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Finding Dory (Ultimate Collector's Edition) (Blu-ray + Blu-ray 3D + DVD + Digital HD)", "qty": "1", "salePrice": 27.96, "_id": "5b2cdd2009a28e3de681d105" }] }, { "_id": "5b2ce38009a28e3de681d113", "updatedAt": "2018-06-22T11:54:40.630Z", "createdAt": "2018-06-22T11:54:40.630Z", "userId": "5b1f6fd4a6724d408d747e46", "customerOrderId": "10", "addressId": "5b1f7190a6724d408d747e58", "lat": "-117.374193", "long": "34.122765", "storeNo": 3131, "name": "Rialto Walmart Neighborhood Market", "address": "300 West Baseline Rd", "city": "Rialto", "zipCode": "92376", "phone": "(909) 546-3019", "stateProvocode": "CA", "country": "US", "__v": 0, "paid": true, "status": 0, "total": "26.62", "fees": "20", "items": [{ "itemId": "38683254", "name": "PNY T4400mAh Black Universal Power Pack (1A Output)", "salePrice": 13.31, "qty": "2", "item_image": "https://i5.walmartimages.com/asr/7d5c4de0-a99b-4e8b-8507-6e9d916b8be3_1.2b0ead361305dc08f4cd0681e3498167.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "_id": "5b2ce38009a28e3de681d114" }] }, { "_id": "5b2ce59209a28e3de681d123", "updatedAt": "2018-06-22T12:03:30.438Z", "createdAt": "2018-06-22T12:03:30.438Z", "long": "-110.9188725", "address": "3435 East Broadway Blvd", "addressId": "5b2ce59109a28e3de681d122", "city": "Tucson", "country": "US", "lat": "32.2236403", "name": "Tucson Supercenter", "phone": "520-917-1655", "stateProvocode": "AZ", "storeNo": 3884, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85716", "customerOrderId": "11", "__v": 0, "paid": true, "status": 0, "total": "22", "fees": "20", "items": [{ "itemId": "50313560", "item_image": "https://i5.walmartimages.com/asr/2595ecca-6310-4cae-bec0-e7ea14f3fee5_1.7561b8c7f3f1f8a3cf2099001ee1fa8e.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Wrangler Husky Boys; Classic 5-Pocket Short - 2 Pack Value Bundle", "qty": "1", "salePrice": 22, "_id": "5b2ce59209a28e3de681d124" }] }, { "_id": "5b2ce66e09a28e3de681d132", "updatedAt": "2018-06-22T12:07:10.885Z", "createdAt": "2018-06-22T12:07:10.885Z", "userId": "5b1f6fd4a6724d408d747e46", "customerOrderId": "12", "addressId": "5b1f7190a6724d408d747e58", "lat": "-117.374193", "long": "34.122765", "storeNo": 3131, "name": "Rialto Walmart Neighborhood Market", "address": "300 West Baseline Rd", "city": "Rialto", "zipCode": "92376", "phone": "(909) 546-3019", "stateProvocode": "CA", "country": "US", "__v": 0, "paid": true, "status": 0, "total": "26.62", "fees": "20", "items": [{ "itemId": "38683254", "name": "PNY T4400mAh Black Universal Power Pack (1A Output)", "salePrice": 13.31, "qty": "2", "item_image": "https://i5.walmartimages.com/asr/7d5c4de0-a99b-4e8b-8507-6e9d916b8be3_1.2b0ead361305dc08f4cd0681e3498167.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "_id": "5b2ce66e09a28e3de681d133" }] }, { "_id": "5b2ce71309a28e3de681d142", "updatedAt": "2018-06-23T18:14:16.576Z", "createdAt": "2018-06-22T12:09:55.431Z", "long": "-78.978894", "address": "1540 Military Rd", "addressId": "5b2ce71209a28e3de681d141", "city": "Niagara Falls", "country": "US", "lat": "43.094308", "name": "Niagara Falls Supercenter", "phone": "716-298-4484", "stateProvocode": "NY", "storeNo": 1909, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "14304", "customerOrderId": "13", "__v": 0, "assignedTo": "5b2cbda709a28e3de681d06b", "paid": true, "status": 2, "total": "2125.44", "fees": "20", "items": [{ "itemId": "115541019", "item_image": "https://i5.walmartimages.com/asr/58e2ccf9-c48a-4199-ac41-f260569a775d_1.592fd1731a7338534a2fc8138031af23.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Magnaflow Performance Exhaust 19172 Exhaust System Kit", "qty": "1", "salePrice": 2125.44, "_id": "5b2ce71309a28e3de681d143" }] }, { "_id": "5b2cf8c109a28e3de681d155", "updatedAt": "2018-06-23T18:13:39.215Z", "createdAt": "2018-06-22T13:25:21.268Z", "long": "-110.953398", "address": "1260 East Tucson Marketplace Blvd", "addressId": "5b2cf8c009a28e3de681d154", "city": "Tucson", "country": "US", "lat": "32.185694", "name": "Tucson Supercenter", "phone": "520-917-0108", "stateProvocode": "AZ", "storeNo": 5626, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85713", "customerOrderId": "14", "__v": 0, "assignedTo": "5b2cbda709a28e3de681d06b", "paid": true, "status": 2, "total": "328.42", "fees": "20", "items": [{ "itemId": "50909944", "item_image": "https://i5.walmartimages.com/asr/7ed3216f-b943-4353-b3fe-331f4e799d0d_1.bb3524d0f1413b54d7c49f79f05fcf24.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Apple iPhone 6S Plus 16GB GSM Smartphone (Unlocked), Refurbished", "qty": "1", "salePrice": 328.42, "_id": "5b2cf8c109a28e3de681d156" }] }, { "_id": "5b2dc3884602e250d3c1505d", "updatedAt": "2018-06-23T12:40:10.866Z", "createdAt": "2018-06-23T03:50:32.029Z", "long": "-110.977172", "address": "7951 N Oracle Rd", "addressId": "5b2dc3864602e250d3c1505c", "city": "Oro Valley", "country": "US", "lat": "32.350839", "name": "Oro Valley Neighborhood Market", "phone": "520-469-9556", "stateProvocode": "AZ", "storeNo": 4264, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85704", "customerOrderId": "22", "__v": 0, "assignedTo": "5b2cbda709a28e3de681d06b", "paid": true, "status": 2, "total": "9.97", "fees": "20", "items": [{ "itemId": "44016706", "item_image": "https://i5.walmartimages.com/asr/1f0f4141-d709-4bbc-b5e7-fb51ae2b2466_1.2f165710e85867062123c7eec25874dc.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Disney Frozen Toddler Girl's Aline Slipper", "qty": "1", "salePrice": 9.97, "_id": "5b2dc3884602e250d3c1505e" }] }, { "_id": "5b306bdcf708af695e039308", "updatedAt": "2018-06-25T04:13:16.377Z", "createdAt": "2018-06-25T04:13:16.377Z", "long": "-110.908802", "address": "3925 E Grant Rd", "addressId": "5b306bdbf708af695e039307", "city": "Tucson", "country": "US", "lat": "32.25197", "name": "Tucson Neighborhood Market", "phone": "520-327-0085", "stateProvocode": "AZ", "storeNo": 3357, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85712", "customerOrderId": "35", "__v": 0, "paid": true, "status": 0, "total": "14.95", "fees": "20", "items": [{ "itemId": "27424651", "item_image": "https://i5.walmartimages.com/asr/3014f18a-ef5f-4409-841a-e3940a4a9ba1_1.42d49102957d5014397acd7e2bcdff6e.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "The Carpenter (Hardcover)", "qty": "1", "salePrice": 14.95, "_id": "5b306bdcf708af695e039309" }] }, { "_id": "5b306e6b2dcdbd71dd99a985", "updatedAt": "2018-06-25T04:24:30.337Z", "createdAt": "2018-06-25T04:24:11.127Z", "long": "-110.908802", "address": "3925 E Grant Rd", "addressId": "5b306e6a2dcdbd71dd99a984", "city": "Tucson", "country": "US", "lat": "32.25197", "name": "Tucson Neighborhood Market", "phone": "520-327-0085", "stateProvocode": "AZ", "storeNo": 3357, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85712", "customerOrderId": "36", "__v": 0, "paid": true, "status": 0, "total": "13.47", "fees": "20", "items": [{ "itemId": "19897918", "item_image": "https://i5.walmartimages.com/asr/c2744ab6-c77b-493c-9f38-92d0bfacc6f2_2.5c48c3dbed06077d49c48a069369c0c5.png?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Armor All Complete Car Care Kit (4 Pieces)", "qty": "1", "salePrice": 13.47, "_id": "5b306e6b2dcdbd71dd99a986" }] }, { "_id": "5b306f1dd28bc771fea0a025", "updatedAt": "2018-06-25T04:27:30.158Z", "createdAt": "2018-06-25T04:27:09.729Z", "long": "-110.908802", "address": "3925 E Grant Rd", "addressId": "5b306f1cd28bc771fea0a024", "city": "Tucson", "country": "US", "lat": "32.25197", "name": "Tucson Neighborhood Market", "phone": "520-327-0085", "stateProvocode": "AZ", "storeNo": 3357, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85712", "customerOrderId": "37", "__v": 0, "paid": true, "status": 0, "total": "99.75", "fees": "20", "items": [{ "itemId": "54980702", "item_image": "https://i5.walmartimages.com/asr/7fed9bd6-c8bf-4705-8571-1d6db8bb44d2_1.b11e8fb9259dd9450cefd796b37beef8.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Dual Double DIN AM/FM/MP3/WMA DVD/CD Receiver, 50W x 4 with Front Panel 3.5mm Aux", "qty": "1", "salePrice": 99.75, "_id": "5b306f1dd28bc771fea0a026" }] }, { "_id": "5b306fb43472bd721d91ba95", "updatedAt": "2018-06-25T04:30:23.427Z", "createdAt": "2018-06-25T04:29:40.213Z", "long": "-110.908802", "address": "3925 E Grant Rd", "addressId": "5b306fb33472bd721d91ba94", "city": "Tucson", "country": "US", "lat": "32.25197", "name": "Tucson Neighborhood Market", "phone": "520-327-0085", "stateProvocode": "AZ", "storeNo": 3357, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85712", "customerOrderId": "38", "__v": 0, "paid": true, "status": 0, "total": "9.56", "fees": "20", "items": [{ "itemId": "44453725", "item_image": "https://i5.walmartimages.com/asr/1543dc57-abdd-4ebd-add6-bf8419ab099c_1.da2b00b93f17e3244042c8ba48c77857.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Color Therapy : An Anti-Stress Coloring Book", "qty": "1", "salePrice": 9.56, "_id": "5b306fb43472bd721d91ba96" }] }, { "_id": "5b3070303472bd721d91baa6", "updatedAt": "2018-06-25T04:32:00.304Z", "createdAt": "2018-06-25T04:31:44.441Z", "long": "-110.9188725", "address": "3435 East Broadway Blvd", "addressId": "5b30702f3472bd721d91baa5", "city": "Tucson", "country": "US", "lat": "32.2236403", "name": "Tucson Supercenter", "phone": "520-917-1655", "stateProvocode": "AZ", "storeNo": 3884, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85716", "customerOrderId": "39", "__v": 0, "paid": true, "status": 0, "total": "14.95", "fees": "20", "items": [{ "itemId": "27424651", "item_image": "https://i5.walmartimages.com/asr/3014f18a-ef5f-4409-841a-e3940a4a9ba1_1.42d49102957d5014397acd7e2bcdff6e.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "The Carpenter (Hardcover)", "qty": "1", "salePrice": 14.95, "_id": "5b3070303472bd721d91baa7" }] }, { "_id": "5b3070da1a6c6972426a83ad", "updatedAt": "2018-06-25T04:35:05.164Z", "createdAt": "2018-06-25T04:34:34.552Z", "long": "-110.9188725", "address": "3435 East Broadway Blvd", "addressId": "5b3070d91a6c6972426a83ac", "city": "Tucson", "country": "US", "lat": "32.2236403", "name": "Tucson Supercenter", "phone": "520-917-1655", "stateProvocode": "AZ", "storeNo": 3884, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85716", "customerOrderId": "40", "__v": 0, "paid": true, "status": 0, "total": "7", "fees": "20", "items": [{ "itemId": "52504872", "item_image": "https://i5.walmartimages.com/asr/aebc0f5b-2696-4169-873f-d52244406954_1.6abf81b065a33901b21db85f4a55e874.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "Dreamworks Trolls Kids Backpack", "qty": "1", "salePrice": 7, "_id": "5b3070da1a6c6972426a83ae" }] }, { "_id": "5b3073c9c97d5872cba1d549", "updatedAt": "2018-06-25T04:52:17.728Z", "createdAt": "2018-06-25T04:47:05.436Z", "long": "-110.9188725", "address": "3435 East Broadway Blvd", "addressId": "5b3073c8c97d5872cba1d548", "city": "Tucson", "country": "US", "lat": "32.2236403", "name": "Tucson Supercenter", "phone": "520-917-1655", "stateProvocode": "AZ", "storeNo": 3884, "userId": "5b1f6fd4a6724d408d747e46", "zipCode": "85716", "customerOrderId": "41", "__v": 0, "assignedTo": "5b16584e22b6cf5d562722ce", "paid": true, "status": 2, "total": "10", "fees": "20", "items": [{ "itemId": "15443069", "item_image": "https://i5.walmartimages.com/asr/bb5f6e69-b389-4eda-b83a-e807643afd38_1.ce4fa2933e99f85886e5c7b74007a4b6.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff", "name": "George Hope Stripe Zip Tie", "qty": "1", "salePrice": 10, "_id": "5b3073c9c97d5872cba1d54a" }] }]
            customerList.allOrders = [];
            _.each(allOrders, function (order) {
                var localOrder = {};
                var localQuestion = [];

                localOrder.orderId = order._id;
                localOrder.orderNo = order.customerOrderId;
                localOrder.storeNo = order.storeNo;
                localOrder.storeName = order.name;
                localOrder.storeAddress = order.address;
                localOrder.storeCity = order.city;
                localOrder.storeZip = order.zipCode;
                localOrder.storeAddress = order.address;
                localOrder.storePhone = order.phone;
                localOrder.paid = order.paid ? 'Payment Done' : 'Pending';
                localOrder.orderStatus = order.status;
                localOrder.fees = order.fees;
                localOrder.total = order.total;
                localOrder.items = order.items;
                localOrder.status = order.status;
                if (order.status === 0) {
                    localOrder.statusText = 'Placed'
                }
                if (order.status === 1) {
                    localOrder.statusText = 'IN PROGRESS'
                }
                if (order.status === 2) {
                    localOrder.statusText = 'DELVIERED'
                }




                customerList.allOrders.push(localOrder);
            })

            console.log(customerList.allOrders)


        }, function (err) {
            console.log(err);
        })

    }

    //customerList.getAllEmployee=function(SPid) {
    //    customerList.showProvider=false;
    //    ServiceProvider.allEmployee({refToSP: SPid}, function (data) {
    //        customerList.allEmployees = [];
    //
    //        _.each(data, function (provider) {
    //            var localProvider = {};
    //            localProvider.providerId = provider._id;
    //            localProvider.name = provider.firstName + ' ' + provider.lastName;
    //            localProvider.description = provider.description;
    //            localProvider.photo = provider.refToUser._id;
    //            localProvider.totalRating = provider.refToRating.NumberOfRating;
    //            localProvider.averageRating = provider.refToRating.AverageRating;
    //
    //            var localServiceOffered = [];
    //            _.each(provider.refToServiceType, function (service) {
    //
    //                if (provider.refToServiceMenu.refToItem.length != 0)
    //                //localProvider.menuItem=provider.refToServiceMenu.refToItem;
    //                {
    //                    _.each(provider.refToServiceMenu.refToItem, function (item) {
    //                        if (service._id == item.serviceTypeId)
    //                            localServiceOffered.push({
    //                                "serviceTypeId": service._id,
    //                                "serviceType": service.serviceType,
    //                                "menu": {"priceEstimate": item.priceEstimate, "title": item.title}
    //                            })
    //                    })
    //                }
    //                else {
    //
    //                    localServiceOffered.push({"serviceTypeId": service._id, "serviceType": service.serviceType})
    //                }
    //
    //            })
    //            localProvider.serviceOffered = localServiceOffered;
    //            customerList.allEmployees.push(localProvider);
    //            console.log(customerList.allEmployees)
    //        })
    //
    //
    //    }, function (err) {
    //        $timeout(function () {
    //        }, 2000)
    //    })
    //}

}
6
