angular.module('yapp')
  .controller('AddGroundCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	$scope.active_state = $state.current.name;
  	$scope.venue = {cost_details: [{cost:"0", from_month: "1", to_month: "12"}], user_id: Session.userId};

  	$scope.add_venue_cost = function(){
  		$scope.venue.cost_details.push({cost:"0", from_month: "1", to_month: "12"});
  	};

  	$scope.delete_venue_cost = function(id){
  		$scope.venue.cost_details.splice(id, 1);
  	};

    $scope.add_venue = function()
    {
      if($scope.venue_form.$valid)
      {
        AuthService.add_venue($scope.venue).then(function(res){
          if(res.code == 200)
          {
            $state.go("ground", {id:res.venue_id});
          }
        });
      }
    };

  });

angular.module('yapp')
  .controller('GroundCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	$scope.active_state = $state.current.name;
    $scope.active_id = $state.params.id === undefined ? -1 : $state.params.id;
    $scope.facility = [];
    $scope.venue = {};
    $scope.venue_facility = {venue_id: $scope.active_id, facility_id: 0, cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};
    $scope.venue_image = {venue_id: $scope.active_id, type:"image"};


    AuthService.allfacility().then(function(res){
      if(res.code == 200)
      {
        $scope.facility = res.data;
      }
    });
    AuthService.getvenuebyid($scope.active_id).then(function(res){
      if(res.code == 200)
      {
        $scope.venue = res.data.venue_details;
      }
    });

    $scope.add_venue_cost = function(){
      $scope.venue.cost_details.push({cost:"0", from_month: "1", to_month: "12"});
    };

    $scope.delete_venue_cost = function(id){
      $scope.venue.cost_details.splice(id, 1);
    };

    $scope.add_venue_facility_cost = function(){
      $scope.venue_facility.cost_details.push({cost:"0", from_month: "1", to_month: "12"});
    };

    $scope.delete_venue_facility_cost = function(id){
      $scope.venue_facility.cost_details.splice(id, 1);
    };

    $scope.add_venue_facility = function()
    {
        AuthService.add_venue_facility($scope.venue_facility).then(function(res){
          if(res.code == 200)
          {
            $("#myModal1").modal("hide");
            $scope.venue_facility = {venue_id: $scope.active_id, facility_id: 0, cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};
          }
        });
    };

    $("#venue_image").change(function(evt){
      var files = evt.target.files;
      var file = files[0];

      if (files && file) {
          var reader = new FileReader();

          reader.onload = function(readerEvt) {
              var binaryString = readerEvt.target.result;
              $scope.$apply(function(){
                $scope.venue_image.image = binaryString;
              });
          };

          reader.readAsBinaryString(file);
      }
    });

    $scope.add_venue_image = function()
    {
        console.log($scope.venue_image.image);
        if($scope.venue_image){
          AuthService.add_venue_image($scope.venue_image).then(function(res){
            if(res.code == 200)
            {
              console.log(res);
            }
          });
        }
    };

  });