'use strict';
const search = require('./search.js')(function(respond){
  let results = respond.results;
  console.log('results', results);
});

search('Werkstudent');
