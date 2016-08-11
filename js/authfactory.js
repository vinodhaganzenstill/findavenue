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
    var url;
        if(month === undefined)
            url = '//zenstill.com/demo/findavenue/api.php?action=venue_details&venue_id='+id;
        else
            url = '//zenstill.com/demo/findavenue/api.php?action=venue_details&venue_id='+id+'&month='+month;

    return $http.get(url)
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

    authService.update_venue = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/api.php?action=updatevenue', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
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

     authService.getallfacilitiesforvenue = function (id) {
    return $http
        .get('http://zenstill.com/findavenue/api/ground_details/getallfacilitiesforvenue.php', {venue_id:id}, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
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
        .post('http://zenstill.com/findavenue/api/ground_details/addvenueimage.php', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.orders = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=myorders&user_id=' +id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.venueorders = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venueorders&user_id=' +id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.venueorderscount = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venueorderscount&user_id=' +id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.order_details = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=orderdetails&order_id=' +id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.getvenuebyuserid = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venues&user_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.getvenue_details = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=venue_details&venue_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.update_profile = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/api.php?action=profileupdate' ,data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.send_otp = function (data) {
    return $http
        .post('//zenstill.com/demo/findavenue/sendotp.php?action=generateOTP' ,data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.verfied_user = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=verfied_user&user_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.get_images_by_venue_id = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=get_images_by_venue_id&venue_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.delete_facility_by_id = function (venue_id, id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=delete_facility_by_id&venue_id='+venue_id+'&facility_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.delete_image_by_id = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=delete_image_by_id&venue_id=1&image_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.getvenuecost = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=getvenuecost&venue_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.getvenuefacilities = function (id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=getvenuefacilities&venue_id='+id)
        .then(function (res) {
            return res['data'];
        });
    };
authService.add_availability = function (day,enddate,venue_id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=add_availability&venue_id='+venue_id+'&day='+day+'&enddate='+enddate)
        .then(function (res) {
            return res['data'];
        });
    };

    authService.add_availability1 = function (day,enddate,venue_id) {
    return $http
        .get('//zenstill.com/demo/findavenue/api.php?action=add_availability1&venue_id='+venue_id+'&day='+day+'&enddate='+enddate)
        .then(function (res) {
            return res['data'];
        });
    };
    authService.isAuthenticated = function () {
        return !!Session.userId;
    };
             
    return authService;
})