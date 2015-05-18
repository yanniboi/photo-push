angular.module('photo-push.services', [])
  .service('Utils', ['$rootScope', '$ionicLoading', '$interval', '$timeout', '$http', function ($rootScope, $ionicLoading, $interval, $timeout,  $http) {
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
        $rootScope.count--;
        if ($rootScope.count == 0) {
          $rootScope.camera.capture();
        }
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

    $rootScope.imageSwitch = function (source) {
      var switchData = $rootScope.image_switch;

      if ($rootScope.image_switch.show_primary) {
        switchData.image_p_classes = 'fade';
        switchData.image_s_src = source;
        $rootScope.image_switch = switchData;
        $timeout(function () {
          switchData.show_primary = false;
          switchData.image_s_classes = 'fade fade-show';
          $rootScope.image_switch = switchData;
        }, 1600);
      }
      else {
        switchData.image_s_classes = 'fade';
        switchData.image_p_src = source;
        $rootScope.image_switch = switchData;
        $timeout(function () {
          switchData.show_primary = true;
          switchData.image_p_classes = 'fade fade-show';
          $rootScope.image_switch = switchData;
        }, 1600);
      }
    };

    // Create utils object.
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
    };

    $rootScope.camera.trigger = function (camera) {
      // Trigger Camera
      var fileName = (new Date().getTime()) + '.jpg';
      //$http.get('/service.php?action=takePicture')
      $http.get('/service.php?action=debugPicture&file='+fileName)
        .success(function(data, status, headers, config) {
          $rootScope.imageSwitch('/images/'+fileName);
          console.log(data);
        })
        .error(function(data, status, headers, config) {
          console.log(data);
        });
      var photoId = camera.trigger();
      return photoId;
    };

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
      };
      var path = copyDebug(source, destination, fileName);
      return path;
    };

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