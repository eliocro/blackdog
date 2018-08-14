(function() {
  var app = angular.module('blackdog', ['ngRoute']);

  /* Routes */
  app.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        controller: null,
        template: ''
      }).
      when('/home', {
        controller: 'HomeCtrl',
        templateUrl: 'partials/home.html'
      }).
      when('/bio', {
        controller: null,
        templateUrl: 'partials/bio.html'
      }).
      when('/dates', {
        controller: 'DatesCtrl',
        templateUrl: 'partials/dates.html'
      }).
      when('/media', {
        controller: 'MediaCtrl',
        templateUrl: 'partials/media.html'
      }).
      when('/contacts', {
        controller: null,
        templateUrl: 'partials/contacts.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  });


  /* Global functions */
  app.run(function ($rootScope, $location, $window) {
    $rootScope.menu = {};
    $rootScope.isActive = function (param) {
      return ($location.path().substr(1) === param) ? 'active' : '';
    };
    $rootScope.$on('$routeChangeStart', function () {
      $rootScope.menu.show = false;
    });
    $rootScope.$on('$viewContentLoaded', function(event) {
      $window._gaq.push(['_trackPageview', $location.path()]);
    });
  });


  /* Aux Functions */
  function getEvents(scope, http, limit) {
    scope.evLoaded = false;

    var start = moment().format('YYYY-MM-DD') + 'T00:00:00Z';
    var calId = 's038vh82nnteu7fbj1n4ct9q9o@group.calendar.google.com';
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
    var params = {
      key: 'AIzaSyCMvMWVL7fQ_AOZA7JDPuB6aqEVVBt4yz0',
      callback: 'JSON_CALLBACK',
      maxResults: limit || 50,
      timeMin: start,
      singleEvents: true,
      orderBy: 'startTime'
    };

    // console.log('Events', url, params);
    http.jsonp(url, { params: params })
    .success(function (data) {
      // console.log('Items', data.items);
      scope.events = [];

      // Parse Events
      for(var i = 0; data.items && i < data.items.length; i++) {
        var ev = data.items[i];
        var start = ev.start.dateTime || ev.start.date;

        scope.events.push({
          title: ev.summary,
          start: moment(start).toDate(),
          details: ev.location
        });
      }
      scope.evLoaded = true;
    })
    .error(function (data, status) {
      console.log('Error', data, status);
      scope.evLoaded = true;
    });
  }

  function getPhotos(scope, http, limit){
    scope.phLoaded = false;

    var url = 'https://api.flickr.com/services/feeds/photos_public.gne';
    var params = {
      id: '84277882@N05',
      jsoncallback: 'JSON_CALLBACK',
      format: 'json'
    };

    // console.log('Photos', url, params);

    http.jsonp(url, { params: params })
    .success(function (data) {
      // console.log(data);
      scope.photos = [];

      // Show Photos
      for(var j = 0; j < data.items.length && j < limit; j++) {
        scope.photos.push(data.items[j]);
      }
      scope.phLoaded = true;
    })
    .error(function (data, status) {
      console.log('Error', data, status);
      scope.phLoaded = true;
    });
  }


  /* Controllers */
  app.controller('HomeCtrl', function ($scope, $http) {
    getEvents($scope, $http, 3);
    getPhotos($scope, $http, 5);
  });

  app.controller('DatesCtrl', function ($scope, $http) {
    getEvents($scope, $http, 35);
  });

  app.controller('MediaCtrl', function ($scope, $http) {
    getPhotos($scope, $http, 15);
  });


  /* Filters */
  app.filter('day', function() {
    return function(input) {
      if(!input){ return '00'; }
      return input.getDate();
    };
  });

  app.filter('month', function() {
    return function(input) {
      if(!input){ return ''; }
      var months = ["jan", "feb", "mar", "apr", "may", "jun", "july",
        "aug", "sept", "oct", "nov", "dec" ];
      return months[input.getMonth()];
    };
  });

})();
