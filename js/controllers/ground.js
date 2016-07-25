angular.module('yapp')
  .controller('AddGroundCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	$scope.active_state = $state.current.name;
  	$scope.venue = {cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};

  	$scope.add_venue_cost = function(){
  		$scope.venue.cost_details.push({cost:"0", from_month: "1", to_month: "12"});
  	};

  	$scope.delete_venue_cost = function(id){
  		$scope.venue.cost_details.splice(id, 1);
  	};

  });

angular.module('yapp')
  .controller('GroundCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	$scope.active_state = $state.current.name;
    $scope.active_id = $state.params.id === undefined ? -1 : $state.params.id;

  });