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
  }])
  .service('CameraUtils', ['$rootScope', '$ionicLoading', '$interval', '$window', function ($rootScope, $ionicLoading, $interval, $window) {
    // Create utils opbject.
    $rootScope.camera = {};
    
    $rootScope.camera.init = function () {
      //var consoleFunction = function (vars)
      // Get camera information.
      var debug = {
        name: 'Canon 70D',
        status: 'active',
        trigger: function (vars) {console.log(vars);}
      };
        
      if (debug.status == 'active') {
        return debug;
      }
      else {
        console.log('Camera init error.');
      }
      
      return {name: 'No camera connected', status: 'Pending'};
    }
 
    $rootScope.camera.trigger = function (camera) {
      // Trigger Camera
      var photoId = camera.trigger();
      return photoId;
    }

    $rootScope.camera.copy = function (photoId) {
      // Get vars.
      var source = 'cameraDirectory',
          destination = 'localDirectory',
          fileName = (new Date().getTime()) + '.jpg';
      
      console.log('filename ' + fileName);
        
      // Copy to harddrive.
      var copyDebug = function(source, destination, fileName) {
        console.log(destination + '/' + fileName);
        return destination + '/' + fileName;
      }
      var path = copyDebug(source, destination, fileName);
      return path;
    }
    
    $rootScope.camera.capture = function () {
      // Check for active camera.
      var camera = $rootScope.camera.init();
      if (camera.status == 'active') {
        var path = '';
        // Trigger picture
        var pictureID = $rootScope.camera.trigger(camera);

        // Copy Picture to destination.
        var path = $rootScope.camera.copy(pictureID);
        
        // Return Path
        return path;
      }  
      
      return false;
    };
  }]);