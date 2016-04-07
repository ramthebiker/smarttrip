var angularApp = angular.module('myApp', [])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])



.service('Geolocator', function ($q, $http) {

  var API_URL = 'https://flightdataapi11.azurewebsites.net/api/iata/';
  this.searchFlight = function (term) {
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
  
  this.searchFlightTo1 = function (term) {
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


  this.searchFlightTo2 = function (term, $scope) {
      var deferred = $q.defer();
      $http.get(API_URL + term).then(function (flights) {
          var _flights = {};
          var flights = flights.data;
          for (var i = 0, len = flights.length; i < len; i++) {
              _flights[flights[i].City + "," + flights[i].IATACode] = flights[i].City + ", " + flights[i].Country + "(" + flights[i].IATACode + ")";
          }
          deferred.resolve(_flights);
      }, function () {
          deferred.reject(arguments);
      });
      return deferred.promise;
  }


  this.searchFlightTo = function (term,$scope) {
     
      
      var dates = $scope.flightCodes;
      
      var deferred = $q.defer();
      
          var _flights = {};
          var flights = dates;
          for (var i = 0, len = 5; i < len; i++)
          {
              _flights[flights[i].City + "," + flights[i].IATACode] = flights[i].City + ", " + flights[i].Country + "(" + flights[i].IATACode + ")";
          }
          deferred.resolve(_flights);
          //deferred.reject(arguments);

            return deferred.promise;
          //return _flights;
  }
  
   
	
})





.controller('myCtrl', function ($scope, $timeout, Geolocator, $http) {
    
    
		$scope.selectedCountry = null;
		$scope.selectedCountryTo = null;
		$scope.countries = {};
		$scope.countriesTo = {};
		$scope.flightCodes = {};
		
		$scope.LoadFlights = function (City, IATACode,Airport) {
			$http({ method: "GET", url: 'https://flightdataapi11.azurewebsites.net/api/trip/' + $scope.From.split(',')[1] + '/' + IATACode + '/' + $scope.TravelDate }).
						then(function (response) {

							$("#lblDestination").html($scope.From.split(',')[0] + " >> " + Airport);
							$scope.Flights = response.data;
							if (response.data.length == 1) {
						        if (response.data[0].ErrorMessage != null) {
						            $("#lblErrorMessage").html(response.data[0].ErrorMessage);
						            $("#dvErrorMessage").show();
						        }
						    }
						    else {
						        $("#dvErrorMessage").hide();

						        //console.log("CHECK 1" + response.data);
						        // var transformed = angular.fromJson(response);        

						    }
							//console.log("CHECK 1" + response.data);
							// var transformed = angular.fromJson(response);        
							//$scope.GetNearByAptData();	
							//$scope.GetSocialFeedsData();
							//$scope.GetWeatherData();
						});
						
						$http({ method: "GET", url: 'https://socialfeedapi11.azurewebsites.net/api/SocialMedia/SocialFeeds/'+ City }).
						then(function (response) {
							$scope.social = response.data;
						});
						
						$http({ method: "GET", url: 'https://weatherapi11.azurewebsites.net/api/weather/'+ City }).
						then(function (response) {
							$scope.whrForecast = response.data;
							
						});
		console.log("CHECK 7" + City);
		}
		//console.log("check -- " + $scope.To );
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
		
  }
  
  
  
		
		
$scope.GetNearByAptData = function () {
			$http({ method: "GET", url: 'https://flightdataapi11.azurewebsites.net/api/NearestAirport/'+ $scope.To.split(',')[1] }).
						then(function (response) {
							$scope.NearbyAirports = response.data;
						});
		}
		
$scope.GetSocialFeedsData = function () {
			$http({ method: "GET", url: 'https://socialfeedapi11.azurewebsites.net/api/SocialMedia/SocialFeeds/'+ $scope.To.split(',')[0] }).
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
			$http({ method: "GET", url: 'https://weatherapi11.azurewebsites.net/api/weather/'+ $scope.To.split(',')[0] }).
						then(function (response) {
							$scope.whrForecast = response.data;
							
						});
		}


$scope.GetFlightData = function () {
			$http({ method: "GET", url: 'https://flightdataapi11.azurewebsites.net/api/trip/' + $scope.From.split(',')[1] + '/' + $scope.To.split(',')[1] + '/' + $scope.TravelDate }).
						then(function (response) {
						    $scope.Flights = response.data;
							$("#lblDestination").html($scope.From.split(',')[0] + " >> " + $scope.To.split(',')[0]); 
							$("#dvDestination").show();
							//console.log("CHECK 1" + response.data);
							// var transformed = angular.fromJson(response);        
							$("#dvDetails").show();
						    if (response.data.length == 1)
						    {
						        if(response.data[0].ErrorMessage != null)
						        {
						            $("#lblErrorMessage").html(response.data[0].ErrorMessage);
						            $("#dvErrorMessage").show();
									//$("#no-more-tables").hide();
									
						        }
						    }
						    else
						    {
						        $("#dvErrorMessage").hide();
                                    
							        //console.log("CHECK 1" + response.data);
							        // var transformed = angular.fromJson(response);        
							        
						    }
							//if(response.data == null)
							//{
								//$("#no-more-tables").hide();
							//}
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
      Geolocator.searchFlightTo(term, $scope).then(function (countriesTo) {
      $scope.countriesTo = countriesTo;
    });
  }
  
  angular.element(document).ready(function () {

      $(".overlay").show();

      var API_URL = 'https://flightdataapi11.azurewebsites.net/api/iata/';

      
      

      $http({ method: "GET", url: 'https://flightdataapi11.azurewebsites.net/api/iata/' }).
						then(function (response)
						{
						    $scope.flightCodes = response.data;

                            
						    var dates = $scope.flightCodes;

						    var _flights = {};
						    var flights = dates;
						    for (var i = 0, len = flights.length; i < len; i++)
						    {
						        _flights[flights[i].City + "," + flights[i].IATACode] = flights[i].City + ", " + flights[i].Country + "(" + flights[i].IATACode + ")";
						    }

						    $scope.countriesTo = _flights;
						    $scope.countries = _flights;
						    //alert('Great');
						    $(".overlay").hide();
						});
  });

  
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

// at the bottom of your controller

