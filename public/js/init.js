
// nomorerack.com live analytics 

var app = angular.module('nomorerack', ['elasticsearch']);

app.controller('dataPull', function($scope, es) {
  es.cluster.health(function (err, resp) {
    if (err) {
      $scope.data = err.message;
    } else {
      $scope.data = resp;
    }
  });
});

app.service('es', function (esFactory) {
  return esFactory({
    host: '10.100.7.179:9200',
    sniffOnStart: true,
    sniffInterval: 300000 
  });
});
