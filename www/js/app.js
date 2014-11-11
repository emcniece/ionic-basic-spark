// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ionic.utils', []);
angular.module('ionicBasicSpark', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $localStorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Load default settings and variables
    $localStorage.$default({
      'accounts': [],
      'cores': {},
      'sparkData': {},
      'settings': {
        sparkApiUrl: "https://api.spark.io/v1/"
      }
    });


  }); // .run

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('main', {
      url: "/main",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('main.tabs', {
      url: '/tab',
      abstract: true,
      views: {
        'menu-content': {
          templateUrl: "templates/tabs.html"
        }
      }
    })

    // Each tab has its own nav history stack:

    .state('main.tabs.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tabs/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('main.tabs.about', {
      url: '/about',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tabs/tab-about.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('main.tabs.accounts', {
      url: '/accounts',
      views: {
        'tab-accounts': {
          templateUrl: 'templates/tabs/tab-accounts.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('main.tabs.account-detail', {
      url: '/accounts/:id',
      views: {
        'tab-accounts': {
          templateUrl: 'templates/detail/account-detail.html',
          controller: 'AccountDetailCtrl'
        }
      }
    })
    .state('main.tabs.account-token', {
      url: '/accounts/:id/tokens',
      views: {
        'tab-accounts': {
          templateUrl: 'templates/detail/account-tokens.html',
          controller: 'AccountTokenCtrl'
        }
      }
    })

    .state('main.tabs.cores', {
      url: '/cores',
      views: {
        'tab-cores': {
          templateUrl: 'templates/tabs/tab-cores.html',
          controller: 'CoresCtrl'
        }
      }
    })
    .state('main.tabs.core-detail', {
      url: '/cores/:id',
      views: {
        'tab-cores': {
          templateUrl: 'templates/detail/core-detail.html',
          controller: 'CoreDetailCtrl'
        }
      }
    })

    .state('main.tabs.listeners', {
      url: '/listeners',
      views: {
        'tab-data': {
          templateUrl: 'templates/tabs/tab-data.html',
          //controller: 'DataCtrl'
        }
      }
    })

    .state('main.tabs.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tabs/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    ; // $stateProvider

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/tab/dash');

});


