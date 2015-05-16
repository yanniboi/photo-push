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

  .controller('photoCtrl', ['$scope', '$rootScope', '$timeout', '$pusher', 'Utils', function($scope, $rootScope, $timeout, $pusher, Utils) {
    $scope.message = '';
    $scope.image_src = 'http://lorempixel.com/1900/1100/';
    $scope.image_classes = 'fade';

    $scope.great = 'fantastic';

    $timeout(function () {
      $scope.image_classes = 'fade fade-show';
    }, 1000);

    var client = new Pusher('361a1976618931c8ef0d', { authEndpoint: 'http://six-gs.com/pusher.yanniboi.com/public_html/index.php' });
    var pusher = $pusher(client);

    var my_channel = pusher.subscribe('private-my-channel');

    my_channel.bind('client-new-price', function(data) {
      console.log(data);

      if (data.hasOwnProperty('type')) {
        switch(data.type) {
        case 'image-update':
          $scope.image_classes = 'fade';
          $timeout(function () {
            $scope.image_src = data.source;
            $scope.image_classes = 'fade fade-show';
          }, 1600);


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
