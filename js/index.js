angular.module('myApp', [])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.service('Geolocator', function($q, $http){
  var API_URL = 'https://flighttp.azurewebsites.net/api/iata/';
  this.searchFlight = function(term) {
    var deferred = $q.defer();
 $http.get(API_URL+term).then(function(flights){
   var _flights = {};
   var flights = flights.data;
   for(var i = 0, len = flights.length; i < len; i++) {
     _flights[flights[i].IATACode] = flights[i].City +", "+ flights[i].Country+"("+flights[i].IATACode+")";
   }
      deferred.resolve(_flights);
    }, function() {
      deferred.reject(arguments);
    });
    return deferred.promise;
  } 
  
  this.searchFlightTo = function(term) {
    var deferred = $q.defer();
 $http.get(API_URL+term).then(function(flights){
   var _flights = {};
   var flights = flights.data;
   for(var i = 0, len = flights.length; i < len; i++) {
     _flights[flights[i].IATACode] = flights[i].City +", "+ flights[i].Country+"("+flights[i].IATACode+")";
   }
      deferred.resolve(_flights);
    }, function() {
      deferred.reject(arguments);
    });
    return deferred.promise;
  }
  
   
	
})
.controller('myCtrl', function($scope, $timeout, Geolocator, $http) {
		$scope.selectedCountry = null;
		$scope.selectedCountryTo = null;
		$scope.countries = {};
		$scope.countriesTo = {};
		$scope.mockSearchFlight = function() {
		$scope.countries= {
		'Zurich': 'Switzerland',
		'Canada': 'Vancouver'
		}
		$scope.countriesTo= {
		'Zurich': 'Switzerland',
		'Canada': 'Vancouver'
		}
		
  }
  
$scope.GetNearByAptData = function () {
			$http({ method: "GET", url: 'https://flighttp.azurewebsites.net/api/NearestAirport/'+ $scope.To }).
						then(function (response) {
							$scope.NearbyAirports = response.data;
						});
		}
		
$scope.GetSocialFeedsData = function () {
			$http({ method: "GET", url: 'http://socialfeedtp.azurewebsites.net/api/SocialMedia/SocialFeeds/'+ $scope.To }).
						then(function (response) {
							$scope.social = response.data;
						});
		}	
		
		
$scope.GetFlightData = function () {
			$http({ method: "GET", url: 'https://flighttp.azurewebsites.net/api/trip/' + $scope.From + '/' + $scope.To + '/' + $scope.TravelDate }).
						then(function (response) {
							$scope.Flights = response.data;
							//console.log("CHECK 1" + response.data);
							// var transformed = angular.fromJson(response);        
							$scope.GetNearByAptData();	
							$scope.GetSocialFeedsData();
						});
		}
		
	
		
  $scope.searchFlight = function(term) {
    Geolocator.searchFlight(term).then(function(countries){
      $scope.countries = countries;
    });
  }
  
  $scope.searchFlightTo = function(term) {
    Geolocator.searchFlightTo(term).then(function(countriesTo){
      $scope.countries = countriesTo;
    });
  }
  
})

.directive('keyboardPoster', function($parse, $timeout){
  var DELAY_TIME_BEFORE_POSTING = 3000;
  return function(scope, elem, attrs) {
    
    var element = angular.element(elem)[0];
    var currentTimeout = null;
   
    element.oninput = function() {
      var model = $parse(attrs.postFunction);
      var poster = model(scope);
      
      if(currentTimeout) {
        $timeout.cancel(currentTimeout)
      }
      currentTimeout = $timeout(function(){
        poster(angular.element(element).val());
      }, DELAY_TIME_BEFORE_POSTING)
    }
  }
})