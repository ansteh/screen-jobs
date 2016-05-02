const request      = require('request');
const credentials  = require('../credentials.js');
const Jobs         = require('./storage.js');

if(credentials === undefined || credentials.publisher === undefined){
  console.log('indeed API publisher key is not defined in credentials.js');
}

function indeed(query, callback){
  var options = {
    url: 'http://api.indeed.com/ads/apisearch',
    qs: {
      v: 2,
      publisher: credentials.publisher,
      q: query,
      format: 'json',
      l: 'saarbrücken',
      sort: '',
      radius: '',
      st: '',
      jt: '',
      start: '',
      limit: '',
      fromage: '',
      filter: '',
      latlong: 1,
      co: 'de',
      chnl: '',
      userip: '1.2.3.4',
      useragent: ''
    }
  };

  request(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    } else {
      callback(Jobs.findByQuery(query));
    }
  });
};

module.exports = function(callback){
  return function (query){
    indeed(query, function(json){
      Jobs.save(json);
      callback(json);
    });
  };
};
