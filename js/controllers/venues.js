'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('VenuesCtrl', function($scope, $timeout, $state, AuthService, $location, Session, $rootScope, $sce) {
    
    if(typeof $rootScope.search != "undefined")
    {
        $scope.search = $rootScope.search;
        delete $rootScope.search;
    }
    

    $scope.venues = [];

  	AuthService.venues().then(function(res){
      if(res['status'] == 'Success')
      {
          $scope.venues = res['data'];
          $scope.actions();
      }
    });

    $scope.signup = function(user, form){
        if(form.$valid){
            AuthService.signup(user).then(function(res){
                if(res.status == "Success")
                {
                    $scope.login(user, form);
                }
                else
                    $scope.$$childHead.msg = res.status;
            });
        }
    };

    $scope.login = function(data, form) {
        if(form.$valid)
        {   
            AuthService.login(data).then(function(res){
                if(res.status == "Success")
                {
                    Session.create(res.data, true);
                    $rootScope.$broadcast('SESSIONCHANGE');
                    if(res.data.status == "1")
                        $location.path('/myprofile');
                    else
                        $state.go('verify_mobile');
                }
                else
                    $scope.$$childHead.msg = res.status;
            }); 
        }
    }

    var month_name=new Array(12);
    month_name[0]="January";
    month_name[1]="February";
    month_name[2]="March";
    month_name[3]="April";
    month_name[4]="May";
    month_name[5]="June";
    month_name[6]="July";
    month_name[7]="August";
    month_name[8]="September";
    month_name[9]="October";
    month_name[10]="November";
    month_name[11]="December";

    $scope.page_data = {};

    $scope.week_booking = {};

    $(document).on('click', ".left", function(){
        $("#myCarousel").carousel("prev");
        console.log("dfsd");
    });
    $(document).on('click', ".right", function(){
        $("#myCarousel").carousel("next");
    });

    $scope.actions = function(){
        if($scope.active_state == 'detail' || $scope.active_state == 'map')
        {
            AuthService.venue_detail($scope.active_id, new Date().getMonth()+1).then(function(res){
                if(res['status'] == 'Success')
                {
                    $scope.page_data = res['data'];
                    $scope.page_data.venue_description = $sce.trustAsHtml($scope.page_data.venue_description);

                    $scope.active_tab_id = 0;
                    $scope.active_tab_image = $scope.page_data.images;
                     $scope.map_url = '<iframe src="https://maps.google.com/maps?&q='+$scope.page_data.address_street+','+$scope.page_data.address_county+','+$scope.page_data.address_town+','+$scope.page_data.address_city+','+$scope.page_data.address_country+'&output=embed" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>';
              
                    $timeout(function(){
                        angular.element('#myCarousel').carousel();
                    }, 1000);
                }
            });
        }
        else if($scope.active_state == 'book')
        {
            var curr = new Date(); 
            var first = curr.getDate() - curr.getDay();

            $scope.get_booking_detail(curr, first);
        }
        else if($scope.active_state == 'order')
        {
            $scope.order_details = Session.cart_details;
            $scope.is_user_logged_in = AuthService.isAuthenticated();
        }
        else if($scope.active_state == 'login' || $scope.active_state == 'signup')
        {
            if(AuthService.isAuthenticated())
                $location.path('/venues');
        }
        else if($scope.active_state == 'verify_mobile')
        {
            if(AuthService.isAuthenticated())
                $location.path('/venues');
        }
        else if($scope.active_state == 'order_success')
        {
            
            $scope.order_details = Session.cart_details;
            var data = {user_id: Session.userId, total_amt: $scope.total_amount(), booking_details: $scope.cart_details};

            AuthService.booking(data).then(function(res){
                Session.cart_details = [];
                $rootScope.$broadcast("CARTCHANGE");
                localStorage.setItem('cart_details', JSON.stringify(Session.cart_details));
                $timeout(function(){$state.go("myprofile");}, 3000);
            });
        }
        else if($scope.active_state == 'order_cancel')
        {

        }
    };

    $scope.clear_cart = function(){
        Session.cart_details = [];
        $scope.order_details = [];
        $rootScope.$broadcast("CARTCHANGE");
        localStorage.setItem('cart_details', JSON.stringify(Session.cart_details));
    };

    $scope.delete_cart_item = function(ind){
        if($scope.order_details[ind].facility_id != '0')
        {
            $scope.order_details.splice(ind, 1);
        }
        else
        {
            var venue_id = $scope.order_details[ind].venue_id;
            var facility_id = $scope.order_details[ind].facility_id;
            var booking_time = $scope.order_details[ind].booking_time;
            var splice_cnt = 1;
            for(var $i=ind+1;$i<$scope.order_details.length;$i++)
            {
                if($scope.order_details[$i].venue_id == venue_id && $scope.order_details[$i].booking_time == booking_time)
                {
                    splice_cnt++;
                }
                else
                    break;
            }
            $scope.order_details.splice(ind, splice_cnt);
        }

        Session.cart_details = $scope.order_details;
        $rootScope.$broadcast("CARTCHANGE");
        localStorage.setItem('cart_details', JSON.stringify(Session.cart_details));
    };

    $scope.place_order = function()
    {
        var data = {user_id: Session.user_id, total_amount: $scope.total_amount(), booking_details: $scope.cart_details};
        
        var $paypal = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&no_note=1&lc=UK&currency_code=GBP&bn=PP-BuyNowBF:btn_buynow_LG.gif:NonHostedGuest";
        $paypal += "&first_name=vino&last_name=gautam&payer_email=dhanavel237vino@gmail.com&item_number=1";

        $paypal += "&business=vinodhagan.samsys@gmail.com&item_name=FindaSportvenue&amount="+$scope.total_amount();
        $paypal += "&return="+window.location.origin+window.location.pathname+"?success";
        $paypal += "&cancel_return="+window.location.origin+window.location.pathname+"?cancel";
        $paypal += "&notify_url="+window.location.origin+window.location.pathname+"#notify";

        /*AuthService.booking(data).then(function(res){
            Session.cart_details = [];
            $rootScope.$broadcast("CARTCHANGE");
            localStorage.setItem('cart_details', JSON.stringify(Session.cart_details));
            $state.go("venues");
        });*/
        window.location.assign($paypal);
    };


    $scope.dfdate = function(db)
    {
        if(db === undefined) return;
        return db.toISOString().slice(0,10);
    };

    $scope.df2date = function(db)
    {
        if(db === undefined) return;

        var month_day = db.getDate();
        var Nth = "th";
        if(month_day === 1 || month_day === 21 || month_day === 31){
            Nth = "st";
        }
        else if(month_day === 2 || month_day === 22){
            Nth = "nd";
        }
        else if(month_day === 3 || month_day === 23){
            Nth = "rd";
        }

        return month_day+Nth+" "+month_name[db.getMonth()]+" "+db.getFullYear();
    };

    $scope.previous_week = function()
    {
        var curr = $scope.firstday;
        var first = curr.getDate() - curr.getDay() - 7;

        $scope.get_booking_detail(curr, first); 
    };

    $scope.next_week = function()
    {
        var curr = $scope.lastday;
        var first = curr.getDate() - curr.getDay() + 7;

        $scope.get_booking_detail(curr, first);
    };

    $scope.get_booking_detail = function(curr, first)
    {
        var dddate = new Date(curr.setDate(first));

        $scope.week_booking = {};
        $scope.weeks = [];
        $scope.hours = [];
        for(var $i=0;$i<=6;$i++)
        {
            if($i!=0)
                dddate = new Date(curr.setDate(curr.getDate() + 1));

            $scope.weeks.push($scope.dfdate(dddate));
            if($i == 0)
            {
                $scope.firstday = dddate;
            }

            if($i == 6)
            {
                $scope.lastday = dddate;
            }

            $scope.week_booking[$scope.dfdate(dddate)] = {};

            for(var $j=6;$j<23;$j++)
            {
                var hhours;
                if($j>9)
                    hhours = $j+':00:00';
                else
                    hhours = $j+':00:00';

                $scope.week_booking[$scope.dfdate(dddate)][hhours] = 0;

                if($i==0)
                {
                    if($j == 11)
                        $scope.hours.push({label: '11AM - 12PM', val: hhours});
                    else if($j == 23)
                        $scope.hours.push({label: '11PM - 12AM', val: hhours});
                    else if($j == 0)
                        $scope.hours.push({label: '12 - 1 AM', val: hhours});
                    else if($j == 12)
                        $scope.hours.push({label: '12 - 1 PM', val: hhours});
                    else if($j>11)
                        $scope.hours.push({label: ($j-12) +' - '+ ($j-12+1) + ' PM', val: hhours});
                    else
                        $scope.hours.push({label: $j+' - '+ ($j+1) + ' AM', val: hhours});
                }
            }
        }
        
        AuthService.venue_detail($scope.active_id, $scope.firstday.getMonth()+1).then(function(res){
            if(res['status'] == 'Success')
            {
                $scope.page_data = res['data'];
            }
        });

        AuthService.booking_detail($scope.dfdate($scope.firstday), $scope.dfdate($scope.lastday), $scope.active_id).then(function(res){
            angular.forEach(res.data, function(v,k){
                angular.forEach(v.booked_time, function(v1,k1){
                    console.log(v.booking_date, v1, $scope.week_booking[v.booking_date][v1]);
                    if(typeof $scope.week_booking[v.booking_date][v1] != "undefined")
                        $scope.week_booking[v.booking_date][v1] = 1;
                });
            });
        });

        angular.forEach(Session.cart_details, function(v,k){
            console.log(v);
            angular.forEach(v.booked_time, function(v1,k1){
                if(typeof $scope.week_booking[v.booking_date][v1] != "undefined" && v.venue_id == $scope.active_id)
                    $scope.week_booking[v.booking_date][v1] = 3;
            });
        });
    };

    $scope.booked_slot = 0;
    $scope.booked_slots = [];
    $scope.order_details = [];
    $scope.booked_slot_divide_bydateandtime = function(){
        $scope.booked_slots = [];
        $scope.order_details = [];
        var pdslot;
        angular.forEach($scope.week_booking, function(v,k){
            pdslot = {booked_date:k, booked_time:[]};
            angular.forEach(v, function(v1,k1){
                if(v1 == 2)
                {
                    pdslot['booked_time'].push(k1);
                }
                else if(pdslot['booked_time'].length)
                {
                    $scope.booked_slots.push(pdslot);
                    pdslot = {booked_date:k, booked_time:[]};
                }
            });

            if(pdslot['booked_time'].length)
                $scope.booked_slots.push(pdslot);
        });


        angular.forEach($scope.booked_slots, function(v,k){
            var mmonth = parseInt($scope.page_data.month) == parseInt(v.booked_date.split("-")[1]);
            var dataa = $scope.change_start_end(v.booked_time);
            var mindex = $scope.order_details.length ? $scope.order_details[$scope.order_details.length - 1].mindex + 1 : 1;
            var data = {mindex: mindex, sindex: 0, cost: (mmonth ? $scope.page_data.cost : $scope.page_data.next_month_cost), name: $scope.page_data.venue_name, venue_id:$scope.page_data.id, facility_id: 0, booking_date:v.booked_date, booked_time: v.booked_time, booking_time:dataa.booking_time, booking_start_time: dataa.booking_start_time, booking_end_time: dataa.booking_end_time, quantity: v.booked_time.length};
            $scope.order_details.push(data);
            angular.forEach($scope.page_data.facilities, function(v1,k1){
                if(v1.selected)
                {
                    var data = {mindex: mindex, sindex: (k1 + 1), cost: (mmonth ? v1.cost : v1.next_month_cost), name: v1.facility_name, venue_id:$scope.page_data.id, facility_id: v1.id, booking_date:v.booked_date, booked_time: v.booked_time, booking_time:dataa.booking_time, booking_start_time: dataa.booking_start_time, booking_end_time: dataa.booking_end_time, quantity: v.booked_time.length};
                    $scope.order_details.push(data);
                }
            });

        });
    };

    $scope.book_slot = function(dt, hr)
    {   
        if($scope.week_booking[dt][hr] == 1 && $scope.week_booking[dt][hr] == 3)
            return; 
        if($scope.week_booking[dt][hr] == 2)
        {
            $scope.week_booking[dt][hr] = 0;
            $scope.booked_slot--;
        }
        else if($scope.week_booking[dt][hr] == 0)
        {
            $scope.week_booking[dt][hr] = 2;
            $scope.booked_slot++;
        }

        $scope.booked_slot_divide_bydateandtime();

    };

    $scope.add_to_cart = function(){
        angular.forEach($scope.order_details, function(v,k){
            Session.cart_details.push(v);
        });
        localStorage.setItem('cart_details', JSON.stringify(Session.cart_details));
        $scope.order_details = [];
        $state.go("order");
    };

    $scope.change_start_end = function(booked_time){
        var arr = {};
        arr['booking_start_time'] = booked_time[0];
        arr['booking_end_time'] = booked_time[booked_time.length - 1];

        arr['booking_end_time'] = (parseInt(arr['booking_end_time'])+1) + ":00:00";

        arr['booking_time'] = parseInt(arr['booking_start_time']) > 12 ? (parseInt(arr['booking_start_time']) - 12) + "PM" : parseInt(arr['booking_start_time'])+(parseInt(arr['booking_start_time']) == 12 ? "PM" : "AM");
        arr['booking_time'] += " - ";
        arr['booking_time'] += parseInt(arr['booking_end_time']) > 12 ? (parseInt(arr['booking_end_time']) - 12) + "PM" : parseInt(arr['booking_end_time'])+(parseInt(arr['booking_end_time']) == 12 ? "PM" : "AM");
        return arr;
    };

    $scope.total_amount = function(){
        var amt = 0;
        angular.forEach($scope.order_details, function(v,k){
            amt +=  v.quantity * parseFloat(v.cost);
        });
        return amt;
    };

    $scope.active_state = $state.current.name;
    $scope.active_id = $state.params.venue_id === undefined ? -1 : $state.params.venue_id;

    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){ 
        $scope.active_state = toState.name;
        $scope.active_id = toParams.venue_id;
        $scope.actions();
    });

    $scope.otp = '';

    $scope.send_otp = function(){
        AuthService.send_otp({"countryCode": "91", "mobileNumber": Session.user.mobile}).then(function(res){
            $scope.$$childTail.otp = res.otp;
            $scope.otp = res.otp;
        });
    };

    $scope.verify_mobile = function(uotp){
        console.log($scope);
        if(uotp == $scope.otp)
        {
            AuthService.verfied_user(Session.user.id).then(function(){
                Session.user.status = '1';
                Session.create(Session.user, true);
                $location.path('/myprofile');
            });
        }
        else
            $scope.$$childTail.msg = "Invalid otp";
    };

  });
