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
    $scope.venue_facilities = [];
    $scope.venue_facilities_id = [];
    $scope.months = {1: 'January', 2: 'February', 3: 'March', 4: 'April',
                    5: 'May', 6: 'June', 7: 'July', 8: 'August',
                    9: 'September', 10: 'October', 11: 'November', 12: 'December'};
                    
                     $scope.number = 31;
    $scope.getNumber = function(num) {
        return new Array(num);   
    }

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
        AuthService.getvenuecost($scope.active_id).then(function(res){
          if(res.status == "Success")
          {
            $scope.venue.cost_details = res.data;
          }
        });
      }
    });

    AuthService.getvenuefacilities($scope.active_id).then(function(res){
      if(res.code == 200)
      {
        $scope.venue_facilities = res.data.facilities;

        $scope.venue_facilities_id = [];

        angular.forEach($scope.venue_facilities, function(v,k){
          $scope.venue_facilities_id.push(v[0].facility_id);
        });
      }
    });

    AuthService.get_images_by_venue_id($scope.active_id).then(function(res){
      if(res.status == "Success")
      {
        $scope.venue_images = res.data.images;
      }
    });

    $scope.add_venue = function()
    {
      if($scope.venue_form.$valid)
      {
        console.log($scope.venue);
        AuthService.update_venue($scope.venue).then(function(res){
          if(res.code == 200)
          {

          }
        });
      }
    };

    $scope.is_selected_speciality = function(id){
      return $scope.venue_facilities_id.indexOf(id) == -1 ? false : true;
    };

    $scope.delete_facility = function(id){
      AuthService.delete_facility_by_id($scope.active_id, id).then(function(res){
        if(res.status == "Success")
        {
          AuthService.getvenuefacilities($scope.active_id).then(function(res){
            if(res.code == 200)
            {
              $scope.venue_facilities = res.data.facilities;

              $scope.venue_facilities_id = [];

              angular.forEach($scope.venue_facilities, function(v,k){
                $scope.venue_facilities_id.push(v.facility_id);
              });
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
        if($scope.editmode)
        {
          AuthService.delete_facility_by_id($scope.active_id, $scope.venue_facility.facility_id).then(function(res){
            if(res.status == "Success")
            {
              AuthService.add_venue_facility($scope.venue_facility).then(function(res){
                if(res.code == 200)
                {
                  //$scope.venue_facility = {venue_id: $scope.active_id, facility_id: 0, cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};
                  AuthService.getvenuefacilities($scope.active_id).then(function(res){
                    if(res.code == 200)
                    {
                      $scope.venue_facilities = res.data.facilities;
                      $scope.venue_facilities_id = [];

                      angular.forEach($scope.venue_facilities, function(v,k){
                        $scope.venue_facilities_id.push(v.facility_id);
                      });
                      $("#myModal1").modal("hide");
                    }
                  });
                }
              });
            }
          });
        }
        else
        {
          AuthService.add_venue_facility($scope.venue_facility).then(function(res){
            if(res.code == 200)
            {
              //$scope.venue_facility = {venue_id: $scope.active_id, facility_id: 0, cost_details: [{cost:"0", from_month: "1", to_month: "12"}]};
              AuthService.getvenuefacilities($scope.active_id).then(function(res){
                if(res.code == 200)
                {
                  $scope.venue_facilities = res.data.facilities;
                  $scope.venue_facilities_id = [];

                  angular.forEach($scope.venue_facilities, function(v,k){
                    $scope.venue_facilities_id.push(v.facility_id);
                  });
                  $("#myModal1").modal("hide");
                }
              });
            }
          });
        }
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
    $scope.add_availability = function()
    {
        AuthService.add_availability($scope.venue_availability.day,$scope.venue_availability.enddate,$scope.active_id).then(function(res){
          if(res.code == 200)
          {
       
          }

        });
    };
    $scope.add_availability1 = function()
    {
        AuthService.add_availability1($scope.venue_availability1.day,$scope.venue_availability1.enddate,$scope.active_id).then(function(res){
          if(res.code == 200)
          {
       
          }

        });
    };

  });