'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('CommonCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $timeout, $state) {

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

    if(AuthService.isAuthenticated())
    {
        if(Session.user.status == "0")
        {
            $timeout(function(){
                $location.path('venues/verify_mobile');
            }, 1000);
        }

        AuthService.venueorderscount(Session.userId).then(function(res){
          if(res['status'] == 'Success')
          {
              $scope.new_bookings = res['data'];
          }
        });
    }

    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
      console.log(toState.name, fromState.name);
      if(AuthService.isAuthenticated())
      {
          if(Session.user.status == "0")
          {
              if(fromState.name == 'venues')
              {
                $timeout(function(){
                  $state.go('verify_mobile');
                }, 1000);
              }
              else
              {
                $location.path('venues');
                $timeout(function(){
                    $state.go('verify_mobile');
                }, 1000);
              }
          }

          AuthService.venueorderscount(Session.userId).then(function(res){
            if(res['status'] == 'Success')
            {
                $scope.new_bookings = res['data'];
            }
          });
      }
    });

  });
