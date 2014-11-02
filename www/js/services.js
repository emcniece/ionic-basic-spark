angular.module('starter.services', [])

/*========================================
=            Accounts Service            =
========================================*/
.service('Accounts', function($localStorage){
  var accounts = $localStorage.accounts;

  return{
    getAccounts: function(){
      return accounts;
    },
    updateAccounts: function(accounts){
      $localStorage.accounts = accounts;
    },
    addAccount: function(account){
      console.log('before: ', $localStorage.accounts);
      $localStorage.accounts.push(account);
      console.log('after: ', $localStorage.accounts);
    },
    removeAccount: function(account){
      console.log('removing', account);
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

;