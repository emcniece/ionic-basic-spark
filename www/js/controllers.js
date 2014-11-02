angular.module('starter.controllers', ['ngStorage'])

.controller('DashCtrl', ['$localStorage', '$scope',
	function($localStorage, $scope) {

		$localStorage.cores = 1;

		console.log( $localStorage);

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
.controller('AccountCtrl', function($localStorage, $scope, $ionicModal) {
	console.log('loaded acct page');

	// Add new account modal
	$ionicModal.fromTemplateUrl('templates/modals/modal-add-account.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

})

/**
 * Modal Popup box and a few button functions
 */
.controller('CreateAcctCtrl', function($localStorage, $scope, $ionicModal, $ionicLoading, $http, Accounts) {

	// Defaults
	$scope.user = {email: "", pass: "", auth: "", valid: 0, checkok: {ok: false, errormsg:""}, token: {} }

	// Checks API for account validity, returns tokens and sets latest active
	$scope.checkAcct = function(){

		if( ($scope.user.email === "") || ($scope.user.pass === "") ){
			$scope.user.checkok.okmsg = false;
			$scope.user.checkok.errormsg = "empty fields.";
			return false;
		}

		$ionicLoading.show({ template: "Testing credentials... <i class='icon ion-loading-c'></i>"});

		var userEncoded = Base64.encode($scope.user.email+':'+$scope.user.pass);

    	$http.defaults.headers.common['Authorization'] = 'Basic ' + userEncoded;
		$http({
			method: 'GET',
			url: "https://api.spark.io/v1/access_tokens"
		})
        .error(function(data, status, headers, config) {

            $ionicLoading.hide();
            $scope.user.checkok.okmsg = data.ok;
            $scope.user.checkok.errormsg = data.errors[0];
        })
        .success(function(data, status, headers, config) {

            $ionicLoading.hide();
            $scope.user.checkok.okmsg = data.ok;
            $scope.user.auth = userEncoded;
            $scope.user.valid=1;

            // set most recent token
            var latestTime = Date.parse(Date());
            angular.forEach(data, function(value, key){
            	var tempDate = Date.parse(value.expires_at);
            	if( tempDate > latestTime) $scope.user.token = value.token;
            });

        });

	} // scope.checkAcct

	// Adds acct from $scope.checkAcct to $localStorage for later use
	$scope.createAcct = function(){

		if( JSON.stringify($localStorage.accounts).indexOf($scope.user.email) === -1){
			// Clean unwanted data
		    var newAcct = {
		    	email: $scope.user.email,
		    	auth: $scope.user.auth,
		    	token: $scope.user.token
		    }
	    	Accounts.addAccount(newAcct);
	    	$scope.modal.hide()
		} else{
		  alert('Account '+$scope.user.email+' exists!');
		}
	}
})



/*=================================
=            Cores Tab            =
=================================*/

.controller('CoresCtrl', function($localStorage, $scope, $ionicModal) {
	console.log('loaded cores page');
	$ionicModal.fromTemplateUrl('templates/modals/modal-add-core.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

})

.controller('DataCtrl', function($scope) {
})

.controller('SettingsCtrl', function($localStorage, $scope, $ionicModal) {

	$localStorage.testvar = "testing 123";

	$scope.clearAllData = function(){
		if( confirm('Cannot undo - clear all app localstorage data?')){
			window.localStorage.clear();
			console.log('cleared', $localStorage);
		}
	}

})



; // angular.module starter.controllers