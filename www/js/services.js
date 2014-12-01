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
  var self = {
    proto: function(){
      return {
        email: "",
        pass: "",
        auth: "",
        valid: 0,
        checkok: {
          ok: false,
          errormsg:""
        },
        token: {}
      };
    },
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
      var merged = merge(account, $localStorage.account[account.id]);

      console.log( '$lS Account :: Update: ', account, merged);
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

  return self;
})

/*=====================================
=            Cores Service            =
=====================================*/

.factory('Cores', function($localStorage) {
  var self = {
    proto: function(){
      // Core prototype determined by AJAX fetch
      return null;
    },
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
      var merged = merge(core, $localStorage.cores[core.id]);

      console.log( '$lS Cores :: Update: ', core, merged);
      $localStorage.cores[core.id] = merged;
    },
    delete: function(coreId){
      delete $localStorage.cores[coreId];
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject'], 10) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };

  return self;
})

/*=========================================
=            Listeners Service            =
=========================================*/

.factory('Listeners', function($rootScope, $localStorage, Cores, Events) {
  var self = {
    proto: function(){
      return {
        enabled: true,
        active: false,
        isJson: false,
        coreId: "",
        listenerId: "",
        eventSource: null,
        events: [],
        listenerType: 'publishEvent', // function, variable
        fnData: false
      };
    },
    all: function() {
      //console.log( '$lS Listeners :: Get: ', $localStorage.listeners);
      return $localStorage.listeners;
    },
    add: function(listener) {
      console.log( '$lS Listeners :: Adding: ', listener);
      $localStorage.listeners[listener.id] = listener;
      return listener;
    },
    get: function(listenerId){
      var get = $localStorage.listeners[listenerId] || false;
      console.log( '$lS Listeners :: Get: ', listenerId, get);

      return get;
    },
    getByCore: function(coreId){
      var core = Cores.get(coreId),
          lst = [];
      angular.forEach($localStorage.listeners, function(listener){
        if( coreId == listener.coreId){

          // Only add specific details - core recursion blows out here
          lst.push({
            id: listener.id,
            listenerName: listener.listenerName,
            active: listener.active,
            enabled: listener.enabled,
            core: {
              name: listener.core.name,
              icon: listener.core.icon,
              color: listener.core.color
            }
          });
        } // if coreId matches

      }); // getByCore

      return lst;
    },
    update: function(listener){
      var merged = merge(listener, $localStorage.listeners[listener.id]);

      console.log( '$lS Listeners :: Update: ', listener, merged);
      $localStorage.listeners[listener.id] = merged;
    },
    start: function(listeners){
      var startedListeners = 0;

      // Account for single listeners to be passed in
      if( typeof(listeners.id) === 'string'){
        listeners = [listeners];
      }

      angular.forEach(listeners, function(listener){

        // Check if conditions are met
        if( listener.coreId && listener.listenerName && !listener.active){

          var core = Cores.get(listener.coreId),
            listenerUrl = $localStorage.settings.sparkApiUrl +
              'devices/' + core.id + '/events?access_token=' +
              core.acctToken;

          // Testing, 123...
          listener.eventSource = new EventSource(listenerUrl);

          // Open sesame
          listener.eventSource.addEventListener('open', function(){
            //testListenerActive = true;
            //error = false;
            //$apply();
          });

          // ..."error" sesame?
          listener.eventSource.addEventListener('error', function(e){
            console.log('listener error: ', e);
            //$scope.testListenerActive = false;
            //$scope.error = "ES listener error.";
          });

          // ... BAM sesame errywhere
          listener.eventSource.addEventListener(listener.listenerName, function(e){
            var data = e.data;

            // Attempt decode if isJson enabled
            if(listener.isJson){
              data = angular.fromJson(e.data) || e.data;
              //if(typeof(data) === 'object') data.html = syntaxHighlight(data);
            }

            Events.add({
              coreId: listener.coreId,
              listenerId: listener.id,
              data: data,
              event: e
            });

            //$rootScope.$broadcast('listeners-updated');
          }); // addEventListener

          listener.active = true;
          listener.enabled = true;
          startedListeners++;
        } // if valid listener
      }); // foreach listeners

      $rootScope.$broadcast('listeners-updated');
      return startedListeners;
    },
    stop: function(listeners){
      // allow for single listeners
      if( typeof(listeners.id) === 'string') listeners = [listeners];

      var stoppedListeners = 0;

      angular.forEach(listeners, function(listener){
        if( !listener.eventSource) listener = self.get(listener.id);
        console.warn('Bug here: alt panes dont refresh, probably due to incomplete listener object.');
        if( listener.active){
          listener.enabled = false;
          listener.active = false;
          if( listener.eventSource)
              listener.eventSource.close();
          stoppedListeners++;
        }
      });

      $rootScope.$broadcast('listeners-updated');
      return stoppedListeners;
    },
    delete: function(listenerId){
      delete $localStorage.listeners[listenerId];
    }
  };

  return self;
})

/*======================================
=            Events Service            =
======================================*/
.factory('Events', function($rootScope, $localStorage, Cores) {
  var self = {
    proto: function(){
      return {
        coreId: "",
        listenerId: "",
        data: null,
        timeStamp: null
      };
    },
    all: function() {
      return $localStorage.events;
    },
    add: function(event) {
      if( typeof(event.id) === 'undefined')
        event.id = event.listenerId + '_'+event.event.timeStamp;

      console.log( '$lS Events :: Adding: ', event);
      $localStorage.events.unshift(event);

      var maxLen = $localStorage.settings.maxDataLength - 1;
      if( $localStorage.events.length > maxLen){
        $localStorage.events = $localStorage.events.slice(0, maxLen);
      }

      $rootScope.$broadcast('events-updated');
      return event;
    },
    get: function(eventId){
      var get = $localStorage.events[eventId] || false;
      console.log( '$lS Events :: Get: ', eventId, get);

      return get;
    },
    getByCore: function(coreId){
      var core = Cores.get(coreId),
          lst = [];
      angular.forEach($localStorage.events, function(event){
        if( coreId == event.coreId){

          // Only add specific details - core recursion blows out here
          lst.push(event);
        } // if coreId matches

      }); // getByCore

      return lst;
    },
    delete: function(listeners){

      if( listeners){
        // allow for single listeners
        if( typeof(listeners.id) === 'string') listeners = [listeners];

        angular.forEach(listeners, function(listener){

            angular.forEach($localStorage.events, function(event, key){
              if( event && (listener.id == event.listenerId)){
                delete $localStorage.events[key];
              }
            });
        });
      } else{
        delete $localStorage.events;
        $localStorage.events = [];
      }

      // Clean deleted elements and broadcast, return
      $localStorage.events = $localStorage.events.filter(function(n){ return n != undefined });
      $rootScope.$broadcast('events-updated');
    }

  };

  return self;
})




/*======================================
=            Ionic Features            =
======================================*/

.service('IonFeats', function($localStorage){
  var self = {
    icons: function(){
      return {
        'ion-ionic' : 'ion-ionic', 'ion-arrow-up-a' : 'ion-arrow-up-a', 'ion-arrow-right-a' : 'ion-arrow-right-a', 'ion-arrow-down-a' : 'ion-arrow-down-a', 'ion-arrow-left-a' : 'ion-arrow-left-a', 'ion-arrow-up-b' : 'ion-arrow-up-b', 'ion-arrow-right-b' : 'ion-arrow-right-b', 'ion-arrow-down-b' : 'ion-arrow-down-b', 'ion-arrow-left-b' : 'ion-arrow-left-b', 'ion-arrow-up-c' : 'ion-arrow-up-c', 'ion-arrow-right-c' : 'ion-arrow-right-c', 'ion-arrow-down-c' : 'ion-arrow-down-c', 'ion-arrow-left-c' : 'ion-arrow-left-c', 'ion-arrow-return-right' : 'ion-arrow-return-right', 'ion-arrow-return-left' : 'ion-arrow-return-left', 'ion-arrow-swap' : 'ion-arrow-swap', 'ion-arrow-shrink' : 'ion-arrow-shrink', 'ion-arrow-expand' : 'ion-arrow-expand', 'ion-arrow-move' : 'ion-arrow-move', 'ion-arrow-resize' : 'ion-arrow-resize', 'ion-chevron-up' : 'ion-chevron-up', 'ion-chevron-right' : 'ion-chevron-right', 'ion-chevron-down' : 'ion-chevron-down', 'ion-chevron-left' : 'ion-chevron-left', 'ion-navicon-round' : 'ion-navicon-round', 'ion-navicon' : 'ion-navicon', 'ion-drag' : 'ion-drag', 'ion-log-in' : 'ion-log-in', 'ion-log-out' : 'ion-log-out', 'ion-checkmark-round' : 'ion-checkmark-round', 'ion-checkmark' : 'ion-checkmark', 'ion-checkmark-circled' : 'ion-checkmark-circled', 'ion-close-round' : 'ion-close-round', 'ion-close' : 'ion-close', 'ion-close-circled' : 'ion-close-circled', 'ion-plus-round' : 'ion-plus-round', 'ion-plus' : 'ion-plus', 'ion-plus-circled' : 'ion-plus-circled', 'ion-minus-round' : 'ion-minus-round', 'ion-minus' : 'ion-minus', 'ion-minus-circled' : 'ion-minus-circled', 'ion-information' : 'ion-information', 'ion-information-circled' : 'ion-information-circled', 'ion-help' : 'ion-help', 'ion-help-circled' : 'ion-help-circled', 'ion-help-buoy' : 'ion-help-buoy', 'ion-asterisk' : 'ion-asterisk', 'ion-alert' : 'ion-alert', 'ion-alert-circled' : 'ion-alert-circled', 'ion-refresh' : 'ion-refresh', 'ion-refreshing' : 'ion-refreshing', 'ion-loop' : 'ion-loop', 'ion-looping' : 'ion-looping', 'ion-shuffle' : 'ion-shuffle', 'ion-home' : 'ion-home', 'ion-search' : 'ion-search', 'ion-flag' : 'ion-flag', 'ion-star' : 'ion-star', 'ion-heart' : 'ion-heart', 'ion-heart-broken' : 'ion-heart-broken', 'ion-gear-a' : 'ion-gear-a', 'ion-gear-b' : 'ion-gear-b', 'ion-toggle-filled' : 'ion-toggle-filled', 'ion-toggle' : 'ion-toggle', 'ion-settings' : 'ion-settings', 'ion-wrench' : 'ion-wrench', 'ion-hammer' : 'ion-hammer', 'ion-edit' : 'ion-edit', 'ion-trash-a' : 'ion-trash-a', 'ion-trash-b' : 'ion-trash-b', 'ion-document' : 'ion-document', 'ion-document-text' : 'ion-document-text', 'ion-clipboard' : 'ion-clipboard', 'ion-scissors' : 'ion-scissors', 'ion-funnel' : 'ion-funnel', 'ion-bookmark' : 'ion-bookmark', 'ion-email' : 'ion-email', 'ion-folder' : 'ion-folder', 'ion-filing' : 'ion-filing', 'ion-archive' : 'ion-archive', 'ion-reply' : 'ion-reply', 'ion-reply-all' : 'ion-reply-all', 'ion-forward' : 'ion-forward', 'ion-share' : 'ion-share', 'ion-paper-airplane' : 'ion-paper-airplane', 'ion-link' : 'ion-link', 'ion-paperclip' : 'ion-paperclip', 'ion-compose' : 'ion-compose', 'ion-briefcase' : 'ion-briefcase', 'ion-medkit' : 'ion-medkit', 'ion-at' : 'ion-at', 'ion-pound' : 'ion-pound', 'ion-quote' : 'ion-quote', 'ion-cloud' : 'ion-cloud', 'ion-upload' : 'ion-upload', 'ion-more' : 'ion-more', 'ion-grid' : 'ion-grid', 'ion-calendar' : 'ion-calendar', 'ion-clock' : 'ion-clock', 'ion-compass' : 'ion-compass', 'ion-pinpoint' : 'ion-pinpoint', 'ion-pin' : 'ion-pin', 'ion-navigate' : 'ion-navigate', 'ion-location' : 'ion-location', 'ion-map' : 'ion-map', 'ion-model-s' : 'ion-model-s', 'ion-locked' : 'ion-locked', 'ion-unlocked' : 'ion-unlocked', 'ion-key' : 'ion-key', 'ion-arrow-graph-up-right' : 'ion-arrow-graph-up-right', 'ion-arrow-graph-down-right' : 'ion-arrow-graph-down-right', 'ion-arrow-graph-up-left' : 'ion-arrow-graph-up-left', 'ion-arrow-graph-down-left' : 'ion-arrow-graph-down-left', 'ion-stats-bars' : 'ion-stats-bars', 'ion-connection-bars' : 'ion-connection-bars', 'ion-pie-graph' : 'ion-pie-graph', 'ion-chatbubble' : 'ion-chatbubble', 'ion-chatbubble-working' : 'ion-chatbubble-working', 'ion-chatbubbles' : 'ion-chatbubbles', 'ion-chatbox' : 'ion-chatbox', 'ion-chatbox-working' : 'ion-chatbox-working', 'ion-chatboxes' : 'ion-chatboxes', 'ion-person' : 'ion-person', 'ion-person-add' : 'ion-person-add', 'ion-person-stalker' : 'ion-person-stalker', 'ion-woman' : 'ion-woman', 'ion-man' : 'ion-man', 'ion-female' : 'ion-female', 'ion-male' : 'ion-male', 'ion-fork' : 'ion-fork', 'ion-knife' : 'ion-knife', 'ion-spoon' : 'ion-spoon', 'ion-beer' : 'ion-beer', 'ion-wineglass' : 'ion-wineglass', 'ion-coffee' : 'ion-coffee', 'ion-icecream' : 'ion-icecream', 'ion-pizza' : 'ion-pizza', 'ion-power' : 'ion-power', 'ion-mouse' : 'ion-mouse', 'ion-battery-full' : 'ion-battery-full', 'ion-battery-half' : 'ion-battery-half', 'ion-battery-low' : 'ion-battery-low', 'ion-battery-empty' : 'ion-battery-empty', 'ion-battery-charging' : 'ion-battery-charging', 'ion-wifi' : 'ion-wifi', 'ion-bluetooth' : 'ion-bluetooth', 'ion-calculator' : 'ion-calculator', 'ion-camera' : 'ion-camera', 'ion-eye' : 'ion-eye', 'ion-eye-disabled' : 'ion-eye-disabled', 'ion-flash' : 'ion-flash', 'ion-flash-off' : 'ion-flash-off', 'ion-qr-scanner' : 'ion-qr-scanner', 'ion-image' : 'ion-image', 'ion-images' : 'ion-images', 'ion-contrast' : 'ion-contrast', 'ion-wand' : 'ion-wand', 'ion-aperture' : 'ion-aperture', 'ion-monitor' : 'ion-monitor', 'ion-laptop' : 'ion-laptop', 'ion-ipad' : 'ion-ipad', 'ion-iphone' : 'ion-iphone', 'ion-ipod' : 'ion-ipod', 'ion-printer' : 'ion-printer', 'ion-usb' : 'ion-usb', 'ion-outlet' : 'ion-outlet', 'ion-bug' : 'ion-bug', 'ion-code' : 'ion-code', 'ion-code-working' : 'ion-code-working', 'ion-code-download' : 'ion-code-download', 'ion-fork-repo' : 'ion-fork-repo', 'ion-network' : 'ion-network', 'ion-pull-request' : 'ion-pull-request', 'ion-merge' : 'ion-merge', 'ion-game-controller-a' : 'ion-game-controller-a', 'ion-game-controller-b' : 'ion-game-controller-b', 'ion-xbox' : 'ion-xbox', 'ion-playstation' : 'ion-playstation', 'ion-steam' : 'ion-steam', 'ion-closed-captioning' : 'ion-closed-captioning', 'ion-videocamera' : 'ion-videocamera', 'ion-film-marker' : 'ion-film-marker', 'ion-disc' : 'ion-disc', 'ion-headphone' : 'ion-headphone', 'ion-music-note' : 'ion-music-note', 'ion-radio-waves' : 'ion-radio-waves', 'ion-speakerphone' : 'ion-speakerphone', 'ion-mic-a' : 'ion-mic-a', 'ion-mic-b' : 'ion-mic-b', 'ion-mic-c' : 'ion-mic-c', 'ion-volume-high' : 'ion-volume-high', 'ion-volume-medium' : 'ion-volume-medium', 'ion-volume-low' : 'ion-volume-low', 'ion-volume-mute' : 'ion-volume-mute', 'ion-levels' : 'ion-levels', 'ion-play' : 'ion-play', 'ion-pause' : 'ion-pause', 'ion-stop' : 'ion-stop', 'ion-record' : 'ion-record', 'ion-skip-forward' : 'ion-skip-forward', 'ion-skip-backward' : 'ion-skip-backward', 'ion-eject' : 'ion-eject', 'ion-bag' : 'ion-bag', 'ion-card' : 'ion-card', 'ion-cash' : 'ion-cash', 'ion-pricetag' : 'ion-pricetag', 'ion-pricetags' : 'ion-pricetags', 'ion-thumbsup' : 'ion-thumbsup', 'ion-thumbsdown' : 'ion-thumbsdown', 'ion-happy' : 'ion-happy', 'ion-sad' : 'ion-sad', 'ion-trophy' : 'ion-trophy', 'ion-podium' : 'ion-podium', 'ion-ribbon-a' : 'ion-ribbon-a', 'ion-ribbon-b' : 'ion-ribbon-b', 'ion-university' : 'ion-university', 'ion-magnet' : 'ion-magnet', 'ion-beaker' : 'ion-beaker', 'ion-flask' : 'ion-flask', 'ion-egg' : 'ion-egg', 'ion-earth' : 'ion-earth', 'ion-planet' : 'ion-planet', 'ion-lightbulb' : 'ion-lightbulb', 'ion-cube' : 'ion-cube', 'ion-leaf' : 'ion-leaf', 'ion-waterdrop' : 'ion-waterdrop', 'ion-flame' : 'ion-flame', 'ion-fireball' : 'ion-fireball', 'ion-bonfire' : 'ion-bonfire', 'ion-umbrella' : 'ion-umbrella', 'ion-nuclear' : 'ion-nuclear', 'ion-no-smoking' : 'ion-no-smoking', 'ion-thermometer' : 'ion-thermometer', 'ion-speedometer' : 'ion-speedometer', 'ion-plane' : 'ion-plane', 'ion-jet' : 'ion-jet', 'ion-load-a' : 'ion-load-a', 'ion-loading-a' : 'ion-loading-a', 'ion-load-b' : 'ion-load-b', 'ion-loading-b' : 'ion-loading-b', 'ion-load-c' : 'ion-load-c', 'ion-loading-c' : 'ion-loading-c', 'ion-load-d' : 'ion-load-d', 'ion-loading-d' : 'ion-loading-d'
      };
    }, // icons
    colors: function(){
      return {
        'light' : 'light',
        'stable' : 'stable',
        'positive' : 'positive',
        'calm' : 'calm',
        'balanced' : 'balanced',
        'energized' : 'energized',
        'assertive' : 'assertive',
        'royal' : 'royal',
        'dark' : 'dark'
      };
    } // colors
  }
  return self;
}) // IonFeats

;