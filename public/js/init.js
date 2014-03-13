// nomorerack.com live analytics 

var app = angular.module('nomorerack', ['elasticsearch', 'nvd3ChartDirectives']);

app.controller('LiveCtrl', function($scope, Timer, es) {

  var liveAmount = 20;

  $scope.$watch( 
    function () { return Timer.data }, function (data) {
      es.search({
        size: 0, 
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
            currentData : {
              range : {
                key_field : "_timestamp",
                value_field : "receipt.summary.total",
                ranges : [
                  //generate this using a loop.
                  { from : moment().subtract('minutes', 15).valueOf(),  to : moment().valueOf() },
                  { from : moment().subtract('minutes', 30).valueOf(),  to : moment().subtract('minutes', 15).valueOf() },
                  { from : moment().subtract('minutes', 45).valueOf(),  to : moment().subtract('minutes', 30).valueOf() },
                  { from : moment().subtract('minutes', 60).valueOf(),  to : moment().subtract('minutes', 45).valueOf() },
                  { from : moment().subtract('minutes', 75).valueOf(),  to : moment().subtract('minutes', 60).valueOf() },
                  { from : moment().subtract('minutes', 90).valueOf(),  to : moment().subtract('minutes', 75).valueOf() },
                  { from : moment().subtract('minutes', 105).valueOf(), to : moment().subtract('minutes', 90).valueOf() },
                  { from : moment().subtract('minutes', 120).valueOf(), to : moment().subtract('minutes', 105).valueOf() },
                  { from : moment().subtract('minutes', 135).valueOf(), to : moment().subtract('minutes', 120).valueOf() },
                  { from : moment().subtract('minutes', 150).valueOf(), to : moment().subtract('minutes', 135).valueOf() },
                ]
              }
            }      
          }
        }

      }).then(function (resp) {

        $scope.currentDate = moment().format("MMM Do, YYYY | h:mmA");
        $scope.liveTotals = [];

        var facetArray = [];

        angular.forEach(resp.facets.currentData.ranges, function ( numbers) {
          
          facetArray.push([ numbers.to, numbers.total ]);
          $scope.liveTotals.push({ 
            finish : moment(numbers.to).format("h:mmA"), 
            start : moment(numbers.from).format("h:mmA"), 
            price : accounting.formatMoney(numbers.total) 
          });

        });
        
        $scope.liveDataChart = [
          {
            "key": "Live Data",
            "values": facetArray
          }
        ];
        
        $scope.xAxisTickFormat_Time_Format = function(){ return function(d){ return moment(d).format("h:mmA")}}
        $scope.colorFunction = function() { return function(d, i) { return '#e40202' }}
        $scope.valueFormatFunction = function(){ return function(d){ return accounting.formatMoney(d)}}

      }, function (err) {console.log(err)});

    }, true);

});


app.factory("Timer", function ($timeout) {
  var time = 60000; // 1 min
  var data = "";
  var updateTimer = function () {
    $timeout(updateTimer, time);

  };
  updateTimer();
  return {
    data : data
  };
});


app.controller('datedCtrl', function($scope, es) {

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
        last24_total : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              { from : moment().startOf('hour').subtract('hour', 24).valueOf(),  to : moment().startOf('hour').valueOf() }
            ]
          }
        },
        last24 : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              //generate this using a loop.
              { from : moment().startOf('hour').valueOf(),  to : moment().valueOf() },
              { from : moment().startOf('hour').subtract('hour', 1).valueOf(),  to : moment().startOf('hour').valueOf() },
              { from : moment().startOf('hour').subtract('hour', 2).valueOf(),  to : moment().startOf('hour').subtract('hour', 1).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 3).valueOf(),  to : moment().startOf('hour').subtract('hour', 2).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 4).valueOf(),  to : moment().startOf('hour').subtract('hour', 3).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 5).valueOf(),  to : moment().startOf('hour').subtract('hour', 4).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 6).valueOf(),  to : moment().startOf('hour').subtract('hour', 5).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 7).valueOf(),  to : moment().startOf('hour').subtract('hour', 6).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 8).valueOf(),  to : moment().startOf('hour').subtract('hour', 7).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 9).valueOf(),  to : moment().startOf('hour').subtract('hour', 8).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 10).valueOf(),  to : moment().startOf('hour').subtract('hour', 9).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 11).valueOf(),  to : moment().startOf('hour').subtract('hour', 10).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 12).valueOf(),  to : moment().startOf('hour').subtract('hour', 11).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 13).valueOf(),  to : moment().startOf('hour').subtract('hour', 12).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 14).valueOf(),  to : moment().startOf('hour').subtract('hour', 13).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 15).valueOf(),  to : moment().startOf('hour').subtract('hour', 14).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 16).valueOf(),  to : moment().startOf('hour').subtract('hour', 15).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 17).valueOf(),  to : moment().startOf('hour').subtract('hour', 16).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 18).valueOf(),  to : moment().startOf('hour').subtract('hour', 17).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 19).valueOf(),  to : moment().startOf('hour').subtract('hour', 18).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 20).valueOf(),  to : moment().startOf('hour').subtract('hour', 19).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 21).valueOf(),  to : moment().startOf('hour').subtract('hour', 20).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 22).valueOf(),  to : moment().startOf('hour').subtract('hour', 21).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 23).valueOf(),  to : moment().startOf('hour').subtract('hour', 22).valueOf() },
              { from : moment().startOf('hour').subtract('hour', 24).valueOf(),  to : moment().startOf('hour').subtract('hour', 23).valueOf() }
            ]
          }
        },
        last7_total : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              { from : moment().startOf('day').subtract('days', 6).valueOf(),  to : moment().valueOf() }
            ]
          }
        },
        last7days : {
          range : {
            key_field : "_timestamp",
            value_field : "receipt.summary.total",
            ranges : [
              { from : moment().startOf('day').valueOf(), to : moment().valueOf() },
              { from : moment().startOf('day').subtract('days', 1).valueOf(),  to : moment().startOf('day').valueOf() },
              { from : moment().startOf('day').subtract('days', 2).valueOf(),  to : moment().subtract('days', 1).valueOf() },
              { from : moment().startOf('day').subtract('days', 3).valueOf(),  to : moment().subtract('days', 2).valueOf() },
              { from : moment().startOf('day').subtract('days', 4).valueOf(),  to : moment().subtract('days', 3).valueOf() },
              { from : moment().startOf('day').subtract('days', 5).valueOf(),  to : moment().subtract('days', 4).valueOf() },
              { from : moment().startOf('day').subtract('days', 6).valueOf(),  to : moment().subtract('days', 5).valueOf() }
            ]
          }
        }
      }
    }

  }).then(function (resp) {
    
    var last24Array = [];
    var last7Array = [];

    $scope.last24 = [];
    $scope.last7 = [];

    $scope.currentDate = moment().format("MMM Do, YYYY");
    $scope.yesterday = moment().subtract('days', 1).format("MMM Do, YYYY");

    $scope.last24_total = accounting.formatMoney(resp.facets.last24_total.ranges[0].total);
    $scope.last24_total_start = moment(resp.facets.last24_total.ranges[0].from).format("MMM Do, YYYY | h:mmA");
    $scope.last24_total_end = moment(resp.facets.last24_total.ranges[0].to).format("MMM Do, YYYY | h:mmA");

    angular.forEach(resp.facets.last24.ranges, function ( numbers) {

      last24Array.push([ numbers.to, numbers.total ]);

      $scope.last24.push({ 
          finish : moment(numbers.to).format("h:mmA"), 
          start : moment(numbers.from).format("h:mmA"), 
          price : accounting.formatMoney(numbers.total) 
        });
    });

    $scope.last7_total = accounting.formatMoney(resp.facets.last7_total.ranges[0].total);
    $scope.last7_total_start = moment(resp.facets.last7_total.ranges[0].from).format("MMM Do, YYYY");
    $scope.last7_total_end = moment(resp.facets.last7_total.ranges[0].to).format("MMM Do, YYYY");

    angular.forEach(resp.facets.last7days.ranges, function ( numbers) {

        last7Array.push([ numbers.to, numbers.total ]);

        $scope.last7.push({ 
          finish : moment(numbers.to).format("MMM Do"), 
          start : moment(numbers.from).format("MMM Do"), 
          price : accounting.formatMoney(numbers.total) 
        });
    });
    $scope.last7Chart = [
      {
        "key": "Live Data",
        "values": last7Array
      }
    ];
    $scope.last24Chart = [
      {
        "key": "Live Data",
        "values": last24Array
      }
    ];
    $scope.xAxisTickFormat_Time_Format_t = function(){ return function(d){ return moment(d).format("h:mmA")}}
    $scope.xAxisTickFormat_Time_Format_m = function(){ return function(d){ return moment(d).format("MMM Do")}}
    $scope.colorFunction = function() { return function(d, i) { return '#e40202' }}
    $scope.valueFormatFunction = function(){ return function(d){ return accounting.formatMoney(d)}}
    $scope.toolTipContentFunction = function(){return function(key, x, y, e, graph) { return '<h5>' +   accounting.formatMoney(y)  + ' at ' + x + '</h5>'}}
    
    $scope.hits = resp.hits.hits;
    $scope.facets = accounting.formatMoney(resp.facets.total_money.terms[0].total);
 
  }, function (err) { console.log(err) });

});

app.service('es', function (esFactory) {
  return esFactory({
    host: '72.2.112.177:9200',
    sniffOnStart: true,
    sniffInterval: 300000 
  });
});
