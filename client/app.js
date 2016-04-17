(function(){
  var app = angular.module('app', ['ngMaterial']);

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
        $scope.results = [];

        Search.apply(function(response){
          $scope.results = response.results;
          $scope.$apply();
        }, function(){
          $scope.message = "No Indeed Publisher Key provided at the backend!";
          $scope.$apply();
        });

        Search.search('node.js');
      }
    };
  });

}());
