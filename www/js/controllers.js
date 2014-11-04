angular.module('starter.controllers', ['ngStorage'])

.controller('DashCtrl', ['$localStorage', '$scope',
    function($localStorage, $scope) {
    }
])

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

/*====================================
=            Accounts Tab            =
====================================*/
.controller('AccountCtrl', function($localStorage, $scope, $ionicModal, Accounts) {
    console.log('loaded acct page');

    // Add new account modal
    $ionicModal.fromTemplateUrl('templates/modals/modal-add-account.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
    });

    // Load or initialize accounts
    $scope.accounts = Accounts.all();

})

.controller('AccountDetailCtrl', function($scope, $ionicNavBarDelegate, $stateParams, Accounts) {
  $scope.account = Accounts.get($stateParams.id);

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.deleteAcct = function(){
    $ionicNavBarDelegate.back();
    Accounts.delete($scope.account.id);
  };

})

.controller('AccountTokenCtrl', function($scope, $ionicNavBarDelegate, $stateParams, Accounts) {
  $scope.account = Accounts.get($stateParams.id);

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.deleteAcct = function(){
    $ionicNavBarDelegate.back();
    Accounts.delete($scope.account.id);
  };

})

/**
 * Modal Popup box and a few button functions
 */
.controller('CreateAcctCtrl', function($scope, $localStorage, $ionicModal, Accounts, SparkAPI) {

    // Defaults
    $scope.user = {email: "", pass: "", auth: "", valid: 0, checkok: {ok: false, errormsg:""}, token: {} };

    // Checks API for account validity, returns tokens and sets latest active
    $scope.checkAcct = function(){

        if( ($scope.user.email === "") || ($scope.user.pass === "") ){
            $scope.user.checkok.okmsg = false;
            $scope.user.checkok.errormsg = "empty fields.";
            return false;
        }

        //$ionicLoading.show({ template: "Testing credentials... <i class='icon ion-loading-c'></i>"});

        SparkAPI.fetch('access_tokens', $scope.user, false, "Testing credentials...").then(

            // success
            function(data){
                var userEncoded = Base64.encode($scope.user.email+':'+$scope.user.pass);

                $scope.user.checkok.okmsg = true;
                $scope.user.auth = userEncoded;
                $scope.user.valid=1;

                // set most recent token
                var latestTime = Date.parse(Date());
                angular.forEach(data, function(value, key){
                    var tempDate = Date.parse(value.expires_at);
                    if( tempDate > latestTime) $scope.user.token = value;
                });

            // failure
            }, function(error){
                console.log('boo', error);
                $scope.user.checkok.okmsg = false;
                $scope.user.checkok.errormsg = error;
            }
        );

    }; // scope.checkAcct

    // Adds acct from $scope.checkAcct to $localStorage for later use
    $scope.createAcct = function(){
        var accts = $localStorage.accounts;
        if( typeof(accts) === 'undefined'){
            $localStorage.accounts = {};
            accts = {};
        }

        if( (typeof(accts) === 'undefined') || (JSON.stringify(accts).indexOf($scope.user.email) === -1)){
            // Find latest id
            var hID = 0;
            if( Object.size(accts) ){
                angular.forEach(accts, function(value, key){
                    if( value.id == hID) hID++;
                });
            }

            // Clean unwanted data
            var newAcct = {
                id: hID,
                email: $scope.user.email,
                auth: $scope.user.auth,
                token: $scope.user.token
            };

            Accounts.add(newAcct);
            $scope.modal.hide();
        } else{
          alert('Account '+$scope.user.email+' exists!');
        }
    }
})



/*=================================
=            Cores Tab            =
=================================*/

.controller('CoresCtrl', function($localStorage, $scope, $ionicModal, Accounts, Cores) {
    console.log('loaded cores page');
    $ionicModal.fromTemplateUrl('templates/modals/modal-add-core.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Load or initialize projects
    $scope.accounts = Accounts.all();
})

.controller('AddCoreCtrl', function( $scope, $localStorage, $ionicModal, Accounts, SparkAPI) {

    $scope.change = function(){
        var account = getObjByKey( 'id', $scope.account.id, Accounts.all() ),
            httpData = {
                access_token: account.token.token
            };


        SparkAPI.fetch('devices', null, httpData, "Retrieving Cores...").then(

            // success
            function(data){
                console.log('yep', data);

            // failure
            }, function(error){
                console.log('boo', error);
            }
        ); // sparkapi
    };

})

/*================================
=            Data Tab            =
================================*/

.controller('DataCtrl', function($scope) {
})



/*====================================
=            Settings Tab            =
====================================*/

.controller('SettingsCtrl', function($localStorage, $scope, $ionicModal) {

    $localStorage.testvar = "testing 123";

    $scope.clearAllData = function(){
        if( confirm('Cannot undo - clear all app localstorage data?')){
            $localStorage.$reset();
            console.log('cleared', $localStorage);
        }
    };

})



; // angular.module starter.controllers