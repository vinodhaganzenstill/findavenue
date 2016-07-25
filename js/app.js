'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */

var states = [
        { name: 'base', state: { abstract: true, url: '', templateUrl: 'views/base.html', data: {text: "Base", visible: false } } },
        { name: 'venues', state: { url: '/venues', parent: 'base', templateUrl: 'views/venues.html', controller: 'VenuesCtrl', data: {text: "Venues", visible: false } } },
        { name: 'add_ground', state: { url: '/add_ground', parent: 'base', templateUrl: 'views/ground.html', controller: 'AddGroundCtrl', data: {text: "Ground", visible: false } } },
        { name: 'ground', state: { url: '/ground/:id', parent: 'base', templateUrl: 'views/ground.html', controller: 'GroundCtrl', data: {text: "Ground", visible: false } } },
        { name: 'home', state: { url: '/home', parent: 'base', templateUrl: 'views/home.html', controller: 'HomeCtrl', data: {text: "Home", visible: false } } },
        { name: 'about', state: { url: '/about', parent: 'base', templateUrl: 'views/about.html', controller: 'AboutCtrl', data: {text: "About us", visible: false } } },
        { name: 'contact', state: { url: '/contact', parent: 'base', templateUrl: 'views/contact.html', controller: 'ContactCtrl', data: {text: "Contact", visible: false } } },
        { name: 'myorder', state: { url: '/myorder', parent: 'base', templateUrl: 'views/myorder.html', controller: 'OrderCtrl', data: {text: "My order", visible: true } } },
        { name: 'detail', state: { url: '/detail/:venue_id', parent: 'venues', templateUrl: 'views/detail.html', data: {text: "Overview", visible: true } } },
        { name: 'book', state: { url: '/book/:venue_id', parent: 'venues', templateUrl: 'views/booking.html', data: {text: "Add Expense", visible: true } } },
        { name: 'map', state: { url: '/map/:venue_id', parent: 'venues', templateUrl: 'views/map.html', data: {text: "Add Rent", visible: true } } },
        { name: 'order', state: { url: '/order', parent: 'venues', templateUrl: 'views/order.html', data: {text: "Checkout", visible: true } } },
        { name: 'login', state: { url: '/login', parent: 'venues', templateUrl: 'views/login.html', data: {text: "Login", visible: false } } },
        { name: 'signup', state: { url: '/signup', parent: 'venues', templateUrl: 'views/signup.html', data: {text: "Login", visible: false } } },
        { name: 'reports', state: { url: '/reports', parent: 'venues', templateUrl: 'views/dashboard/reports.html', data: {text: "Reports", visible: true } } },
        { name: 'logout', state: { url: '/login', data: {text: "Logout", visible: false }} }
    ];
   
angular.module('yapp', [
                'ui.router',
                'ngAnimate'
            ])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when('/', '/home');
            $urlRouterProvider.otherwise('/home');
            
            angular.forEach(states, function (state) {
                $stateProvider.state(state.name, state.state);
            });
        })


.factory('AuthService', function ($http, Session) {
    var authService = {};
             
    authService.venues = function () {
    return $http
        .get('http://zenstill.com/demo/findavenue/api.php?action=venues')
        .then(function (res) {
            return res['data'];
        });
    };

    authService.venue_detail = function (id,month) {
    return $http
        .get('http://zenstill.com/demo/findavenue/api.php?action=venue_details&venue_id='+id+'&month='+month)
        .then(function (res) {

            return res['data'];
        });
    };

    authService.booking_detail = function (start,end,id) {
    return $http
        .get('http://zenstill.com/demo/findavenue/api.php?action=checkavailability&start_date='+start+'&end_date='+end+'&venue_id='+id)
        .then(function (res) {

            return res['data'];
        });
    };

    authService.login = function (data) {
    return $http
        .post('http://zenstill.com/demo/findavenue/api.php?action=login', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.signup = function (data) {
    return $http
        .post('http://zenstill.com/demo/findavenue/api.php?action=signup', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };

    authService.booking = function (data) {
    return $http
        .post('http://zenstill.com/demo/findavenue/api.php?action=addbooking', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(function (res) {
            return res['data'];
        });
    };
             
    authService.isAuthenticated = function () {
        return !!Session.userId;
    };
             
    return authService;
})
.factory('Cookies', function ($http) {
    var cookies = {};
             
    cookies.put = function (cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
             
    cookies.get = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
             
    return cookies;
})
.service('Session', function (Cookies) {
    this.create = function (user, save) {
        this.userId = user.id;
        this.user = user;
        if(save)
        Cookies.put("auth", JSON.stringify(user));
    };
    this.destroy = function () {
        this.userId = null;
        this.user = null;
        Cookies.put("auth", "");
    };
    this.cart_details = [];
})
.constant('AUTH_REDIRECT', {
    loginredirect: '/dashboard/',
    logoutredirect: '/'
})
.run(function($rootScope, $location, AuthService, Session, AUTH_REDIRECT, Cookies) {
    if(!!Cookies.get("auth"))
        Session.create(JSON.parse(Cookies.get("auth")), false);

    var cart_details = localStorage.getItem('cart_details');
    Session.cart_details = cart_details === null ? [] : JSON.parse(cart_details);
});
