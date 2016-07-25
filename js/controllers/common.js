'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('CommonCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope) {

  	$scope.session_user = Session.user;

  	$scope.is_user_logged_in = AuthService.isAuthenticated();

  	$rootScope.$on('SESSIONCHANGE', function(){
  		$scope.session_user = Session.user;

  		$scope.is_user_logged_in = AuthService.isAuthenticated();
  	});

  	$rootScope.$on('CARTCHANGE', function(){
  		$scope.cart_details = Session.cart_details;
  	});

  	$scope.logout = function()
  	{
  		Session.destroy();
  		$scope.session_user = Session.user;
		$scope.is_user_logged_in = AuthService.isAuthenticated();
  	};

  	$scope.cart_details = Session.cart_details;

  	$scope.total_amount = function(){
        var amt = 0;
        angular.forEach($scope.cart_details, function(v,k){
            amt +=  v.quantity * parseFloat(v.cost);
        });
        return amt;
    };

  });
