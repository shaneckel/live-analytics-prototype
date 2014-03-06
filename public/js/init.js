
// nomorerack.com live analytics 

var app = angular.module('nomorerack', ['elasticsearch']);

app.controller('dataPull', function($scope, es) {
  
  $scope.date = moment().format("MMM Do, YYYY");
  
  es.search({
    size: 10, 
    body :{
      query: {
        filtered: {
          filter: {
            bool: {
              must: [
                {
                  terms: {
                    _type: [
                      "receipt"
                    ]
                  }
                },
                {
                  terms: {
                    host: [
                      "mobile.nomorerack.com"
                    ]
                  }
                }
              ],
              must_not: [
                {
                  term: {
                    privateBrowsing: {
                      value: true
                    }
                  }
                }
              ]
            }
          }
        }
      },
      facets: {
        total_money: {
          terms_stats: {
            key_field : "event",
            value_field : "receipt.summary.total"
          }
        },
        last30 : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              { 
                from: moment().subtract('minutes', 35).valueOf(), 
                to: moment().valueOf()
              }
            ]
          }
        },
        today : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              { 
                from: moment().startOf('day').valueOf(), 
                to: moment().valueOf()
              }
            ]
          }
        }        
      }
    }
                  

  }).then(function (resp) {

    console.log(resp);
      
    $scope.hits = resp.hits.hits;
    $scope.facets = accounting.formatMoney(resp.facets.total_money.terms[0].total);
    $scope.last30 = accounting.formatMoney(resp.facets.last30.ranges[0].total); 
    $scope.today = accounting.formatMoney(resp.facets.today.ranges[0].total); 

  }, function (err) {
    console.log(err); 
    $scope.data = err;
  });
});

app.service('es', function (esFactory) {
  return esFactory({
    host: '72.2.112.177:9200',
    sniffOnStart: true,
    sniffInterval: 300000 
  });
});
