angular.module('yapp')
  .controller('AddGroundCtrl', function($scope, Session, $location, AUTH_REDIRECT, AuthService, $rootScope, $state) {

  	$scope.active_state = $state.current.name;
  	$scope.venue = {cost_details: [{cost:"0", from_month: "1", to_month: "12"}], user_id: Session.userId};

  	$scope.validate_cost = function(cost_details, ind){

      if(cost_details[ind].to_month == "12")
      {
        cost_details.splice(ind + 1, cost_details.length - (ind+1));
      }
      else
      {
        cost_details.splice(ind + 1, cost_details.length - (ind+1));
        cost_details.push({cost:"0", from_month: (parseInt(cost_details[ind].to_month)+1).toString(), to_month: "12"});
      }

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
    $scope.venue_full_details = {};
    $scope.venue_images = [];
    $scope.search = {};
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

    AuthService.venue_detail($scope.active_id).then(function(res){
      if(res.status == "Success")
      {
        $scope.venue_full_details = res.data;
      }
    });

    AuthService.getallfacilitiesforvenue($scope.active_id).then(function(res){
      if(res.code == 200)
      {
        console.log(res.data);
        $scope.venue_facility = res.data;
      }
    });

    AuthService.get_images_by_venue_id($scope.active_id).then(function(res){
      if(res.status == "Success")
      {
        $scope.venue_images = res.data.images;
      }
    });

    $scope.delete_facility = function(id){
      AuthService.delete_facility_by_id($scope.active_id, id).then(function(res){
        if(res.status == "Success")
        {
          AuthService.venue_detail($scope.active_id).then(function(res){
              if(res.status == "Success")
              {
                $scope.venue_full_details = res.data;
              }
            });
        }
      });
    };

    $scope.delete_image = function(id){
      AuthService.delete_image_by_id(id).then(function(res){
        if(res.status == "Success")
        {
          AuthService.get_images_by_venue_id($scope.active_id).then(function(res){
            if(res.status == "Success")
            {
              $scope.venue_images = res.data.images;
            }
          });
        }
      });
    };

    $scope.add_venue_facility = function()
    {
        AuthService.add_venue_facility($scope.venue_facility).then(function(res){
          if(res.code == 200)
          {
            //$scope.venue_facility = {venue_id: $scope.active_id, facility_id: 0, cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};
            AuthService.venue_detail($scope.active_id).then(function(res){
              if(res.status == "Success")
              {
                $scope.venue_full_details = res.data;
                $("#myModal1").modal("hide");
              }
            });
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
                $scope.venue_image.venue_images = [{image: binaryString, media_type: "image", media_title: "Title", media_description: "Description"}];
              });
          };

          reader.readAsDataURL(file);
      }
    });

    $scope.add_venue_image = function()
    {
        if($scope.venue_image){
          AuthService.add_venue_image($scope.venue_image).then(function(res){
            if(res.code == 200)
            {
              AuthService.get_images_by_venue_id($scope.active_id).then(function(res){
                if(res.status == "Success")
                {
                  $scope.venue_images = res.data.images;
                  $("#myModal2").modal("hide");
                }
              });
            }
          });
        }
    };

    $scope.validate_cost = function(cost_details, ind){

      if(cost_details[ind].to_month == "12")
      {
        cost_details.splice(ind + 1, cost_details.length - (ind+1));
      }
      else
      {
        cost_details.splice(ind + 1, cost_details.length - (ind+1));
        cost_details.push({cost:"0", from_month: (parseInt(cost_details[ind].to_month)+1).toString(), to_month: "12"});
      }

    };

  });