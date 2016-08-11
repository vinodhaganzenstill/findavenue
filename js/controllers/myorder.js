angular.module('yapp')
  .controller('MyProfileCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope) {

	$scope.orders = [];
	
	$scope.user_details= Session.user;

    $scope.booking_details = [];
    $scope.myvenues = [];
    $scope.ordervenue_details = [];

  	AuthService.orders(Session.userId).then(function(res){
      if(res['status'] == 'Success')
      {
          $scope.orders = res['data'];
          $scope.user= Session.user.name;
      }
    });

	$scope.order_details = function(id) {
	 AuthService.order_details(id).then(function(res){
	      if(res['status'] == 'Success')
	      {
	          $scope.booking_details = res['data'];
	      }
	    });
	};
   
   AuthService.getvenuebyuserid(Session.userId).then(function(res){
      if(res['status'] == 'Success')
      {
          $scope.myvenues = res['data'];
      }
    });

   $scope.getvenue_details = function(id) {
	 AuthService.getvenue_details(id).then(function(res){
	      if(res['status'] == 'Success')
	      {
	          $scope.ordervenue_details = res['data'];
	      }
	    });
	};

	 $scope.update_profile = function(user, form){
        if(form.$valid){
        	console.log("valid");
            AuthService.update_profile(user).then(function(res){
                if(res['status'] != "error")
                {
                	Session.destroy(user);
                	Session.create(res['data'], true);
                    $rootScope.$broadcast('SESSIONCHANGE');
                    $scope.user_details = res['data'];
                    console.log(res['data']);
                }
            });
        }
    };
  	
  	console.log($scope.ordervenue_details);

  });

  angular.module('yapp')
  .controller('MyOrderCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope) {

  $scope.orders = [];
  
  $scope.user_details= Session.user;

    $scope.booking_details = [];
    $scope.myvenues = [];
    $scope.ordervenue_details = [];

    AuthService.venueorders(Session.userId).then(function(res){
      if(res['status'] == 'Success')
      {
          $scope.orders = res['data'];
          $scope.user= Session.user.name;
      }
    });

  $scope.order_details = function(id) {
   AuthService.order_details(id).then(function(res){
        if(res['status'] == 'Success')
        {
            $scope.booking_details = res['data'];
        }
      });
  };
   
  });
