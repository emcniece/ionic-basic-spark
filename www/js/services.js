angular.module('starter.services', [])

/*=========================================
=            Spark API Service            =
=========================================*/
.service('SparkAPI', function($localStorage, $http, $q, $ionicLoading){
  return {
    fetch: fetch
  }

  function fetch(path, account, data, template){

    if( typeof(account) !== 'undefined' && (account) ){
      var userEncoded = Base64.encode(account.email+':'+account.pass);
      $http.defaults.headers.common['Authorization'] = 'Basic ' + userEncoded;
    }

    if( typeof(template) === 'undefined') template = "Requesting... ";

    $ionicLoading.show({ template: template + "<i class='icon ion-loading-c'></i>"});
console.log( 'data: ', data);
    var request = $http({
      method: 'GET',
      data: data,
      url: $localStorage.settings.sparkApiUrl + path
    });

    return( request.then(handleSuccess, handleError));

  }; // fetch

  function handleSuccess(response, status){
    $ionicLoading.hide();
    return response.data;
  }
  function handleError(response){

    $ionicLoading.hide();
    if (! angular.isObject( response.data ) || !response.statusText) {
      return( $q.reject( "An unknown error occurred." ) );
    }

    // Otherwise, use expected error message.
    return( $q.reject( response.statusText ) );
  }


})

/*========================================
=            Accounts Service            =
========================================*/

.factory('Accounts', function($localStorage) {
  return {
    all: function() {
      //var accountString = $localStorage.accounts;
      //console.log(accountString, angular.fromJson(accountString) );
      //if(1) {
      //  return $localStorage.accounts;
      //}
      return $localStorage.accounts;
    },
    /* not used atm
    save: function(accounts) {
      $localStorage.accounts = angular.toJson(accounts);
    },
    */
    add: function(account) {
      $localStorage.accounts[account.id] = account;
      return account;
    },
    get: function(accountId){
      return $localStorage.accounts[accountId];
    },
    update: function(account){
      $localStorage.accounts[account.id] = account;
    },
    delete: function(accountId){
      delete $localStorage.accounts[accountId];
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

/*=====================================
=            Cores Service            =
=====================================*/

.factory('Cores', function($localStorage) {
  return {
    all: function() {
      return $localStorage.cores;
    },
    add: function(core) {
      $localStorage.cores[core.id] = core;
      return account;
    },
    get: function(coreId){
      return $localStorage.cores[coreId];
    },
    update: function(core){
      $localStorage.accounts[core.id] = core;
    },
    delete: function(coreId){
      delete $localStorage.core[coreId];
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

;