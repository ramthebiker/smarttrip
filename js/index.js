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
     _flights[ flights[i].City+"," + flights[i].IATACode ] = flights[i].City +", "+ flights[i].Country+"("+flights[i].IATACode+")";
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
     _flights[flights[i].City+"," + flights[i].IATACode ] = flights[i].City +", "+ flights[i].Country+"("+flights[i].IATACode+")";
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
		
		console.log("check -- " + $scope.To );
       // var selLocation =	$scope.To ;
		//var selLocCode = ( selLocation.split(',')[0] ) ;
		//var selLocDesc = ( selLocation.split(',')[1] ) ;
		
		$scope.mockSearchFlight = function() {
		$scope.countries= {
		'Zurich': 'Switzerland',
		'Canada': 'Vancouver'
		}
		$scope.countriesTo= {
		'Zurich': 'Switzerland',
		'Canada': 'Vancouver'
		}
		
		  
   $scope.LoadTabData = function() {
   console.log("CHECK 1");
  }
  
		
  }
  
$scope.GetNearByAptData = function () {
			$http({ method: "GET", url: 'https://flighttp.azurewebsites.net/api/NearestAirport/'+ $scope.To.split(',')[1] }).
						then(function (response) {
							$scope.NearbyAirports = response.data;
						});
		}
		
$scope.GetSocialFeedsData = function () {
			$http({ method: "GET", url: 'https://socialfeedtp.azurewebsites.net/api/SocialMedia/SocialFeeds/'+ $scope.To.split(',')[0] }).
						then(function (response) {
							$scope.social = response.data;
						});
		}
		
		/*$scope.GetWeatherData = function () {
			$http({ method: "GET", url: 'http://nextgen-env.us-west-2.elasticbeanstalk.com/api/weather/'+ $scope.To + '/' + $scope.TravelDate }).
						then(function (response) {
							$scope.whrForecast = response.data;
						});
		}
		
		$scope.GetWeatherData = function () {
			$http({ method: "GET", url: 'https://nextgen-env.us-west-2.elasticbeanstalk.com/api/weather/London/'+ $scope.TravelDate }).
						then(function (response) {
							$scope.whrForecast = response.data;
						});
						$http.defaults.headers.put = {
	        'Access-Control-Allow-Origin': '*',
	        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
	        };
		}*/
		$scope.GetWeatherData = function () {
			$http({ method: "GET", url: 'https://openmapweatherapi.azurewebsites.net/api/weather/'+ $scope.To.split(',')[0] }).
						then(function (response) {
							$scope.whrForecast = response.data;
							
						});
						}
$scope.GetFlightData = function () {
			$http({ method: "GET", url: 'https://flighttp.azurewebsites.net/api/tripdev/' + $scope.From.split(',')[1] + '/' + $scope.To.split(',')[1] + '/' + $scope.TravelDate }).
						then(function (response) {
							$scope.Flights = response.data;
							//console.log("CHECK 1" + response.data);
							// var transformed = angular.fromJson(response);        
							$scope.GetNearByAptData();	
							$scope.GetSocialFeedsData();
							$scope.GetWeatherData();
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