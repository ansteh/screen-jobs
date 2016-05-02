(function(){
  var app = angular.module('app', ['ngMaterial']);

  app.config(['$mdIconProvider', function($mdIconProvider) {
    $mdIconProvider
      .iconSet('material', 'client/icons/sets/css/svg/sprite.css.svg');
  }]);

  app.factory('Search', function(){
    var socket = io();

    function search(query){
      socket.emit('search', query);
    };

    function apply(cb, fail){
      socket.on('results', function(results){
        cb(results);
      });
      socket.on('missing-indeed-key', function(){
        fail();
      });
    };

    return {
      search: search,
      apply: apply
    };
  });

  app.directive('indeed', function(Search){
    return {
      restrict: 'E',
      templateUrl: 'client/indeed.tpl.html',
      controller: function($scope){
        $scope.jobs = [];

        Search.apply(function(response){
          $scope.jobs = response.results;
          $scope.$apply();
        }, function(){
          $scope.message = "No Indeed Publisher Key provided at the backend!";
          $scope.$apply();
        });

        $scope.search = function(query){
          Search.search(query);
        }

        Search.search('javascript');
      }
    };
  });

  app.controller('AutocompleteCtrl', function($timeout, $q, $log, $http, $scope) {
    var self = this;
    self.simulateQuery = true;
    self.isDisabled    = false;
    // list of `state` value/display objects
    self.states        = [];
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newState = newState;
    self.getJobsByQuery = self.getJobsByQuery;
    function newState(state) {
      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    }

    $http({
      method: 'GET',
      url: '/corpus'
    }).then(function successCallback(response) {
      console.log('successCallback', response);
      self.states = response.data.map( function (query) {
        return {
          value: query.toLowerCase(),
          display: query
        };
      });
      //$scope.$apply();
    }, function errorCallback(response) {
      console.log('errorCallback', response);
    });

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $scope.search(item.value);
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    function getJobsByQuery(query){
      $log.info('getJobsByQuery' + query);
      $scope.search(query);
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  });
}());
