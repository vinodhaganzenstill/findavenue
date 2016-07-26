angular.module('yapp')

.factory('AuthService', function ($http, Session) {
    var authService = {};
             
    authService.venues = function () {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venues')
        .then(function (res) {
            return res['data'];
        });
    };

    authService.venue_detail = function (id,month) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venue_details&venue_id='+id+'&month='+month)
        .then(function (res) {

            return res['data'];
        });
    };

    authService.booking_detail = function (start,end,id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=checkavailability&start_date='+start+'&end_date='+end+'&venue_id='+id)
        .then(function (res) {

            return res['data'];
        });
    };

    authService.login = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/api.php?action=login', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.signup = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/api.php?action=signup', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.booking = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/api.php?action=addbooking', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.add_venue = function (data) {
    return $http
        .post('//zenstill.com/findavenue/api/ground_details/uploadvenue.php', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.allfacility = function () {
    return $http
        .get('//zenstill.com/findavenue/api/ground_details/get_all_facility.php')
        .then(function (res) {
            return res['data'];
        });
    };

    authService.getvenuebyid = function (id) {
    return $http
        .post('//zenstill.com/findavenue/api/ground_details/get_venue_byid.php', {venue_id:id}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };
    
    authService.add_venue_facility = function (data) {
    return $http
        .post('//zenstill.com/findavenue/api/ground_details/add_venue_facility.php', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.add_venue_image = function (data) {
    return $http
        .post('//zenstill.com/findavenue/api/ground_details/add_venue_image.php', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };
             
    return authService;
})