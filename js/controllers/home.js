angular.module('yapp')
  .controller('HomeCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	if(window.location.href.indexOf("success") != -1)
  	{
  		$state.go("order_success");
  	}
  	else if(window.location.href.indexOf("cancel") != -1)
  	{
  		$state.go("order_cancel");
  	}

    $scope.save_search_data = function(){
      $rootScope.search = $scope.search;
      $state.go("venues");
    };

  });