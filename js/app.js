(function() {
  var app = angular.module('blackdog', ['ngRoute']);

  /* Routes */
  app.config(function($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.useXDomain = true;
    $locationProvider.hashPrefix('!');
    // $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        controller: null,
        template: ''
      }).
      when('/home', {
        controller: HomeCtrl,
        templateUrl: './partials/home.html'
      }).
      when('/bio', {
        controller: null,
        templateUrl: './partials/bio.html'
      }).
      when('/dates', {
        controller: DatesCtrl,
        templateUrl: './partials/dates.html'
      }).
      when('/media', {
        controller: MediaCtrl,
        templateUrl: './partials/media.html'
      }).
      when('/contacts', {
        controller: ContactCtrl,
        templateUrl: './partials/contacts.html'
      }).
      otherwise({
        redirectTo: '/'
      });
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

  /* Global functions */
  app.run(function ($rootScope, $location) {
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

  /* Controllers */
  function HomeCtrl($scope, $http, $rootScope) {
    getEvents($scope, $http, 3, 140);
    getPhotos($scope, $http, 5);
    $rootScope.active = 3;
  }

  function DatesCtrl($scope, $http, $rootScope) {
    getEvents($scope, $http, 25, 1000);
    $rootScope.active = 3;
  }

  function MediaCtrl($scope, $http) {
    getPhotos($scope, $http, 15);
  }

  function ContactCtrl($scope, $http) {
    $scope.sending = false;
    $scope.contact = {};

    $scope.sendContact = function () {
      $scope.sending = true;
      console.log($scope.contact);
      return;

      var subject = "Novo contacto do site: " + contact.subject;
      var body = "<b>Nome:</b> " + contact.name + "<br/><b>Email:</b> " +
        contact.email + "<br/><b>Assunto:</b> " + contact.subject + "<br/><br/>" +
        contact.message;

      $http.post('http://www.projecto24.com/contacto/enviar/externo/', {
          subject: subject,
          from: contact.email,
          body: body,
          token: 12572394
      })
      .success(function(data) {
        if( data === '0' ){
          alert('Message Sent. Thank You.');
          $scope.contact = {};
        }
        else {
          alert('Message Failed. Please try again later.');
          $scope.sending = false;
        }
      })
      .error(function (data, status) {
        alert('Message Failed. Please try again later.');
        $scope.sending = false;
      });

      if(!$scope.$$phase) $scope.$apply();
    };
  }

  /* Aux Functions */
  function getEvents(scope, http, results, trim) {
    var start = moment().format('YYYY-MM-DD');
    var url = 'https://www.google.com/calendar/feeds/s038vh82nnteu7fbj1n4ct9q9o%40'+
      'group.calendar.google.com/public/full?alt=jsonc'+
      '&max-results=1000&start-min=' + start + 'T00:00:00&callback=JSON_CALLBACK';

    // console.log('Events', url);
    scope.evLoaded = false;

    http.jsonp(url)
    .success(function (data) {
      // console.log(data);
      var eventsList = [];
      // Parse Events
      for(var i = 0; i < data.data.items.length; i++ ){
        var event = data.data.items[i];
        eventsList.push({
          "title" : event.title,
          "start" : moment(event.when[0].start).toDate(),
          "details" : (event.details.length > trim) ? (event.details.substr(0, trim) + '...') : event.details
        });
      }
      // Sort Events
      eventsList.sort(function(a,b) {
        return a.start - b.start;
      });
      // Show Events
      scope.events = [];
      for(var j = 0; j < eventsList.length && j < results; j++) {
        scope.events.push(eventsList[j]);
      }
      scope.evLoaded = true;
    })
    .error(function (data, status) {
      // console.log('Error', data, status);
      alert('Error ' + status);
      scope.evLoaded = true;
    });
  }

  function getPhotos(scope, http, results){
    var url = 'http://api.flickr.com/services/feeds/photos_public.gne'+
      '?format=json&jsoncallback=JSON_CALLBACK&id=84277882@N05';

    // console.log('Photos', url);
    scope.phLoaded = false;

    http.jsonp(url)
    .success(function (data) {
      // console.log(data);
      // Show Photos
      scope.photos = [];
      for(var j = 0; j < data.items.length && j < results; j++) {
        scope.photos.push(data.items[j]);
      }
      scope.phLoaded = true;
    })
    .error(function (data, status) {
      // console.log('Error', data, status);
      alert('Error ' + status);
      scope.phLoaded = true;
    });
  }

})();
