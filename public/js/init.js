
// nomorerack.com live analytics 

var app = angular.module('nomorerack', ['elasticsearch']);

app.controller('dataPull', function($scope, es) {
  

  $scope.date = moment().format("MMM Do, YYYY");;
  
  es.search({
    index: 'events-' + moment().format('YYYY.MM.DD'),
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
        "total_money": {
            terms_stats: {
              key_field : "event",
              value_field : "receipt.summary.total"
            }
        }
      }
    }

  }).then(function (resp) {
    console.log(resp);
    $scope.hits = resp.hits.hits;
    $scope.facets = accounting.formatMoney(resp.facets.total_money.terms[0].total);
   
    console.dir(resp.hits.hits);
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
