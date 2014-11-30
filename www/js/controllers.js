angular.module('starter.controllers', ['ngStorage'])

.controller('MainCtrl', function($localStorage, $scope, $ionicSideMenuDelegate, Listeners) {

  // Start up events
  initListeners(true);

  $scope.$on('listeners-updated', function(){
    initListeners();
  });

  function initListeners(firstRun){
    // Set up listeners
    $scope.listeners = Listeners.all();

    angular.forEach($scope.listeners, function(listener){
      if(firstRun) listener.active = false;

      if(listener.enabled && (firstRun || listener.active) ){
        Listeners.start(listener);
      }
    });

  }

	$scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

})

.controller('DashCtrl', function($localStorage, $scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $ionicPopover, Cores, Listeners, Events) {

	$scope.cores = Cores.all();
  $scope.events = Events.all();

  var totalList = 0;
  $scope.listeners = Listeners.all();
  $scope.numLst = Object.size($scope.listeners);
  $scope.num

  // used for individual popups
  $scope.activeCore = false;
  $scope.activeLsts = $scope.listeners;

  // Set up cores
  angular.forEach($scope.cores, function(core){
    core.listeners = Listeners.getByCore(core.id);
    core.numLst = core.listeners.length;
  });

  // Update lists
  $scope.$on('events-updated', function(e, args){
    $scope.events = Events.all();
    $ionicSlideBoxDelegate.update();
  });

	$scope.nextSlide = function() {
		console.log('nextSlide');
    $ionicSlideBoxDelegate.next();
  };

  $ionicPopover.fromTemplateUrl('templates/popovers/popover-dash-listener.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event, core){
    if(typeof(core) !== 'undefined'){
      $scope.activeCore = core;
      $scope.activeLsts = $scope.activeCore.listeners;
    }
    else{
      $scope.activecore = false;
      $scope.activeLsts = $scope.listeners;
    }

    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  $scope.deleteData = function(){
    Events.delete();
  }

})

.controller('AboutCtrl', function($scope) {
  // ho hum
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

/*====================================
=            Accounts Tab            =
====================================*/
.controller('AccountCtrl', function($localStorage, $scope, $ionicModal, Accounts) {

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
    $scope.user = Accounts.proto();

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

                $scope.createAcct();

            // failure
            }, function(error){
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
                    if( ( typeof(value.id) !== 'undefined') && (value.id == hID)) hID++;
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
            $scope.accounts = Accounts.all();
            $scope.createAccount.$setPristine();
            $scope.modal.hide();
        } else{
          $scope.user.checkok.okmsg = false;
          $scope.user.checkok.errormsg = 'Account already registered';
        }
    };
})



/*=================================
=            Cores Tab            =
=================================*/

.controller('CoresCtrl', function($localStorage, $scope, $timeout, $ionicModal, Accounts, Cores, SparkAPI) {

    $ionicModal.fromTemplateUrl('templates/modals/modal-add-core.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.doRefresh = function() {
      console.log( {name: 'Incoming todo ' + Date.now()} );

      $scope.activeAcctTokens = {};
      $scope.acctsProcessed = 0;
      $scope.acctsToProcess = 0;

      // Gather accounts from listed cores
      angular.forEach($scope.cores, function(core){
        if( typeof(core.acctToken) !== 'undefined'){
          $scope.activeAcctTokens[core.acctToken] = core.acctToken;
        }
      });

      $scope.acctsToProcess = Object.size($scope.activeAcctTokens);

      if( $scope.acctsToProcess < 1){
        $scope.loadingDone();
        console.log('Core list error: ', $scope.cores);
        alert('Error - no accounts in core details. Please refresh core list.');
      }

      // Poll unique accounts for core details
      angular.forEach($scope.activeAcctTokens, function(token){

        SparkAPI.fetch('devices', null, {access_token: token} ).then(

          // success
          function(data){
            $scope.acctsProcessed++;

            // Update core details
            angular.forEach(data, function(core){
              if( Cores.get(core.id)){
                Cores.update(core);
              }
            });

            // Leave if we're done
            if( ($scope.acctsToProcess == $scope.acctsProcessed)  ){
              $scope.loadingDone();
            }

          // failure
          }, function(error){
            $scope.acctsProcessed++;
          }
        ); // SparkAPI


      });

    }; // $scope.doRefresh

    $scope.loadingDone = function(){
      $scope.$broadcast('scroll.refreshComplete');
      $timeout(function(){ $scope.$apply(); });
    };

    // Load or initialize projects
    $scope.cores = Cores.all();

})

.controller('AddCoreCtrl', function( $scope, $localStorage, $ionicModal, Accounts, Cores, SparkAPI) {

    $scope.errorMsg = false;
    $scope.accounts = Accounts.all();

    $scope.change = function(){
      var account = getObjByKey( 'id', $scope.account.id, Accounts.all() ),
        httpData = {
            access_token: account.token.token
        };

      SparkAPI.fetch('devices', null, httpData, "Retrieving Cores...").then(

        // success
        function(data){
          $scope.accountCores = data;

        // failure
        }, function(error){
          $scope.errorMsg = error;
        }
      ); // SparkAPI

    };

    $scope.selectCore = function(core){

      // Toggle 'selected' attribute
      if( (typeof(core.selected) === 'undefined') || (core.selected === false) ){
        core.selected = true;
      } else{
        core.selected = false;
      }

    };

    $scope.addSelectedCores = function(){

      // Compile selected cores
      // Bug: figure out why newly added cores don't have accounts with them
      // console.log( $scope.acount.id, Accounts.get($scope.account.id) )

      var acctToken = Accounts.get($scope.account.id).token.token;
      var selectedCores = [];
      angular.forEach($scope.accountCores, function(core){

        // Add associated account token to core for storage and quick access
        core['acctToken'] = acctToken;
        if( core.selected === true) Cores.add(core); //selectedCores.push(core);
      });

      $scope.cores = selectedCores;
      $scope.modal.hide();

    };

})

.controller('CoreDetailCtrl', function($scope, $ionicNavBarDelegate, $ionicModal, $stateParams, Cores, Accounts, IonFeats) {

  // Icon color select modal
  $ionicModal.fromTemplateUrl('templates/modals/modal-core-iconcolor.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.core = Cores.get($stateParams.id);
  $scope.account = Accounts.getByToken($scope.core.acctToken);

  $scope.icons = IonFeats.icons();
  $scope.colors = IonFeats.colors();

  $scope.openModal = function(){
    $scope.modal.show();
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
  };

  $scope.setCoreIcon = function(){
    $scope.core.icon = this.icon;
  };
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.deleteCore = function(coreId){
    if(typeof(coreId) === 'undefined') coreId = $scope.core.id;
    $ionicNavBarDelegate.back();
    Cores.delete(coreId);
  };

})

/*================================
=            Listeners Tab       =
================================*/

.controller('ListenerCtrl', function($scope, $ionicNavBarDelegate, $ionicModal, Listeners, Cores) {

  var listeners = Listeners.all();
  angular.forEach(listeners, function(lst){
    lst.core = Cores.get(lst.coreId);
  });
  $scope.listeners = listeners;

  $ionicModal.fromTemplateUrl('templates/modals/modal-add-listener.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
  });

})
/**
 * Modal Popup box and a few button functions
 */
.controller('CreateListenerCtrl', function($scope, $localStorage, $ionicModal, Cores, Listeners) {

    // Defaults
    // Bug: figure out why newly added listeners don't have cores associated with them
    // console.log( $scope.cores);

  $scope.cores = Cores.all();
  $scope.listener = Listeners.proto();

  $scope.testListenerActive = false;
  $scope.error = false;

  $scope.coreChange = function(){
    $scope.core = Cores.get($scope.listener.coreId);
    $scope.resetListener();
  };

  $scope.resetListener = function(clearEvents){
    if( $scope.listener.eventSource){
      $scope.listener.eventSource.close();
      if( clearEvents){
        $scope.listener.events = [];
      }
    }
    $scope.error = false;
    $scope.testListenerActive = false;
  };

  $scope.testListener = function(){

    // Failsafe for multiple events
    $scope.resetListener(true);

    // Check if conditions are met
    if( $scope.listener.coreId && $scope.listener.listenerName){

      var core = Cores.get($scope.listener.coreId),
        listenerUrl = $localStorage.settings.sparkApiUrl +
          'devices/' + core.id + '/events?access_token=' +
          core.acctToken;

      // Testing, 123...
      $scope.listener.eventSource = new EventSource(listenerUrl);

      // Open sesame
      $scope.listener.eventSource.addEventListener('open', function(){
        $scope.testListenerActive = true;
        $scope.error = false;
        $scope.$apply();
      });

      // ..."error" sesame?
      $scope.listener.eventSource.addEventListener('error', function(e){
        console.log('listener error: ', e);
        $scope.testListenerActive = false;
        $scope.error = "ES listener error.";
      });

      // ... BAM sesame errywhere
      $scope.listener.eventSource.addEventListener($scope.listener.listenerName, function(e){
        var data = e.data;

        // Attempt decode if isJson enabled
        if($scope.listener.isJson){
          data = angular.fromJson(e.data) || e.data;
          //if(typeof(data) === 'object') data.html = syntaxHighlight(data);
        }

        $scope.listener.events.push( data);
        $scope.$apply();
      });

    } else{
      $scope.error = "Fill out core and event name fields.";
    }

  };

  $scope.addListener = function(){

    // Clear unwanted data
    $scope.resetListener(true);
    delete $scope.listener.events;

    // Re-assign needed data
    var listId = $scope.listener.coreId +'_'+ $scope.listener.listenerName.replace(/\s+/g, '-').toLowerCase();
    $scope.listener.core = $scope.core;
    $scope.listener.id = listId;
    $scope.listener.enabled = true;
    //$scope.listener.active = true;
    Listeners.add( $scope.listener);
    $scope.modal.hide();
  };

})

.controller('ListenerDetailCtrl', function($rootScope, $scope, $state, $stateParams, $ionicNavBarDelegate, Listeners) {

  $scope.listener = Listeners.get($stateParams.id);

  $scope.updateListener = function(){

    if( $scope.listener.active){
      $scope.listener.active = false;
      $scope.listener.eventSource.close();
    } else{
      Listeners.start($scope.listener);
      $rootScope.$broadcast('listeners-updated');
    }
  }

  $scope.deleteListener = function(){
    Listeners.delete($scope.listener.id);
    $ionicNavBarDelegate.back();
  };

  $scope.goBack = function(){
    $state.go('main.tabs.listeners');
  }

})


/*====================================
=            Settings Tab            =
====================================*/

.controller('SettingsCtrl', function($localStorage, $scope, $ionicModal) {

    $scope.settings = $localStorage.settings;

    $scope.clearEventData = function(){
        if( confirm('Cannot undo - clear all core event data?')){
            $localStorage.events = [];
            console.log('cleared events', $localStorage);
        }
    };

    $scope.clearAllData = function(){
        if( confirm('Cannot undo - clear all app localstorage data?')){
            $localStorage.$reset();
            console.log('cleared', $localStorage);
        }
    };

})



; // angular.module starter.controllers