// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('photo-push', [
  'ionic',
  'photo-push.services',
  'pusher-angular'
])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  // Set up our routing and state structure
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "photoCtrl"
      });

    $urlRouterProvider.otherwise('/');
  })

  .controller('globalCtrl', ['$scope', '$rootScope', '$timeout', '$pusher', 'Utils',  function($scope, $rootScope, $timeout, $pusher, Utils ) {
    $scope.trigger = function (e) {
      console.log(e.keyCode);
      if (e.keyCode == 13 || e.keyCode == 32) {
        $rootScope.countdown(5);
      }
    };
  }])

  .controller('photoCtrl', ['$scope', '$rootScope', '$timeout', '$pusher', 'Utils',  function($scope, $rootScope, $timeout, $pusher, Utils ) {
    $scope.message = '';
    $scope.image_switch = $rootScope.image_switch = {};
    $scope.image_switch.image_p_src = 'http://lorempixel.com/1900/1100/';
    $scope.image_switch.image_s_src = '';
    $scope.image_switch.image_p_classes = 'fade';
    $scope.image_switch.image_s_classes = 'fade';
    $scope.image_switch.show_primary = true;
      
    $scope.camera = $rootScope.camera.init();
      
    $scope.$watch('camera', function() {
      $scope.camera_connected = !!($scope.camera.hasOwnProperty('status') && $scope.camera.status == 'active');
    });

    $rootScope.$watch('image_switch', function() {
      $scope.image_switch = $rootScope.image_switch;
    });
    
    $timeout(function () {
      //$rootScope.countdown(5);
    }, 4000);
    
    $timeout(function () {
      $scope.image_switch.image_p_classes = 'fade fade-show';
    }, 1000);

    var client = new Pusher('361a1976618931c8ef0d', { authEndpoint: 'http://six-gs.com/pusher.yanniboi.com/public_html/index.php' });
    var pusher = $pusher(client);

    var my_channel = pusher.subscribe('private-my-channel');

    my_channel.bind('client-new-price', function(data) {
      console.log(data);

      if (data.hasOwnProperty('type')) {
        switch(data.type) {
        case 'image-update':
          $rootScope.imageSwitch(data.source);
      
          break;
        case 'message':
          $rootScope.notify(data.message);

          break;
          case 'countdown':
            $rootScope.countdown(5);

            break;
        default:
            console.log('Unknown message of type: ' + data.type);
        }
      }
      else {
        $rootScope.notify('Bad request received.');
      }
    });

  }]);
