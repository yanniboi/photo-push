angular.module('photo-push.services', [])
  .service('Utils', ['$rootScope', '$ionicLoading', '$interval', '$window', function ($rootScope, $ionicLoading, $interval, $window) {
    $rootScope.show = function (text, duration) {
      $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading...',
        noBackdrop: false,
        duration: duration ? duration : 0
      });

      //console.log($rootScope);
    };

    $rootScope.countdown = function (seconds) {
      $rootScope.loading = $ionicLoading.show({
        templateUrl: 'templates/countdown.html',
        scope: $rootScope,
        noBackdrop: false,
        duration: ((seconds * 1000) + 100)
      });

      $rootScope.count = seconds;
      $interval(function () {
        console.log($rootScope.count);
        $rootScope.count--;
        console.log($rootScope.count);
      }, 1000, seconds);

    };



    $rootScope.hide = function () {
      $ionicLoading.hide();
    };


    $rootScope.notify =function(text){
      $rootScope.show(text, 2000);
    };

    // Method to check for internet connection.
    $rootScope.checkNetwork = function () {
      if (typeof navigator.connection === 'undefined') {
        // If you can't check connection, assume it exists.
        return true;
      }
      else if (navigator.connection.type == 0) {
        console.log('Connection not accessible');
        return true;
      }
      else if (navigator.connection.type == Connection.NONE) {
        return false;
      }
      return true;
    };
  }]);