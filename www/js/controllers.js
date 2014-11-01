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

	console.log( $localStorage);


	$scope.clearAllData = function(){
		if( confirm('Cannot undo - clear all app localstorage data?')){
			window.localStorage.clear();
			console.log('cleared', $localStorage);
		}
	}

})



; // angular.module starter.controllers