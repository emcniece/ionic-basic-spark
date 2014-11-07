angular.module('starter.services', [])

/*=========================================
=            Spark API Service            =
=========================================*/
.service('SparkAPI', function($localStorage, $http, $q, $ionicLoading){
  return {
    fetch: fetch
  };

  function fetch(path, account, params, template){

    delete $http.defaults.headers.common['Authorization'];
    if( typeof(account) !== 'undefined' && (account) ){
      var userEncoded = Base64.encode(account.email+':'+account.pass);
      $http.defaults.headers.common['Authorization'] = 'Basic ' + userEncoded;
    }

    if( typeof(template) !== 'undefined'){
      template += " <i class='icon ion-loading-c'></i> ";
      $ionicLoading.show({ template: template + ""});
    }

    console.log( 'SparkAPI Send: ', path, params);

    var request = $http({
      method: 'GET',
      params: params,
      url: $localStorage.settings.sparkApiUrl + path
    });

    return( request.then(handleSuccess, handleError));

  } // fetch

  function handleSuccess(response, status){
    $ionicLoading.hide();
    console.log('SparkAPI success: ', response);
    return response.data;
  }

  function handleError(response){
    console.log('SparkAPI error: ', response);
    $ionicLoading.hide();
    if (! angular.isObject( response.data ) || !response.statusText) {
      return( $q.reject( "An unknown error occurred." ) );
    }

    // Otherwise, use expected error message.
    return( $q.reject( response.data.error_description || response.statusText ) );
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
      console.log( '$lS Account :: Adding: ', account);
      $localStorage.accounts[account.id] = account;
      return account;
    },
    get: function(accountId){
      var get = $localStorage.accounts[accountId] || false;
      console.log( '$lS Account :: Get: ', accountId, get);

      return get;
    },
    getByToken: function(accountToken){
      var account = false;
      angular.forEach($localStorage.accounts, function(acct, key){
        if( acct.token.token === accountToken) account = acct;
      });

      console.log( '$lS Account :: getByToken: ', account);
      return account;
    },
    update: function(account){
      var merged = merge($localStorage.accounts[account.id], core)

      console.log( '$lS Account :: Update: ', core, merged);
      $localStorage.accounts[account.id] = merged;
    },
    delete: function(accountId){
      delete $localStorage.accounts[accountId];
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject'], 10) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
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
      console.log( '$lS Cores :: Adding: ', core);
      $localStorage.cores[core.id] = core;
      return core;
    },
    get: function(coreId){
      var get = $localStorage.cores[coreId] || false;
      console.log( '$lS Cores :: Get: ', coreId, get);

      return get;
    },
    update: function(core){
      var merged = merge($localStorage.cores[core.id], core)

      console.log( '$lS Cores :: Update: ', core, merged);
      $localStorage.cores[core.id] = merged;
    },
    delete: function(coreId){
      delete $localStorage.core[coreId];
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject'], 10) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
})

;