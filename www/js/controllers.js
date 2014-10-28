angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('CoresCtrl', function($scope) {
})

.controller('DataCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope) {
})

; // angular.module starter.controllers