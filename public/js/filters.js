'use strict';

/* Filters */

angular.module('myApp').
filter('interpolate', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    })
    .filter('capitalize', function() {
        return function(input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    })
    .filter('filterOrderByCategory', function() {
        return function(input, category) {
            if (input) {
                return input.filter(function(ord) {

                    if (ord.serviceCategory == category)
                        return true;
                    if (category == 'all')
                        return true;

                    return false

                })
            }
        }
    })
    .filter('filterOrderByStatus', function() {
        return function(input, status) {
            if (input) {
                return input.filter(function(ord) {
                    console.log(ord.status)
                    if (ord.status == status)
                        return true;
                    if (status == 'all')
                        return true;

                    return false

                })
            }
        }
    })
    .filter('filterOrderByServiceDate', function(currentTime) {
        return function(input, status) {
            if (input) {
                return input.filter(function(ord) {

                    switch (status) {
                        case 'all':
                            return true;
                        case 'week':
                            if (ord.serviceDate > currentTime.startWeek && ord.serviceDate < currentTime.endWeek)
                                return true;
                            return false;

                        case 'today':
                            if (ord.serviceDate > currentTime.today && ord.serviceDate < currentTime.tomorrow)
                                return true;
                            return false;

                    }


                })
            }
        }
    });