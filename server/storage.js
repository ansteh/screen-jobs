'use strict';
const path    = require('path');
const _       = require('lodash');
const low     = require('lowdb');
const storage = require('lowdb/file-sync');
const db      = low(path.resolve(__dirname, './resources/jobs.json'), { storage });
const natural = require('natural');
const TfIdf   = natural.TfIdf;

exports.all = function(){
  return db('jobs').value();
};

exports.findByQuery = function(query){
  let result = _.find(exports.all(), { query: query });
  /*let jobList = result.results;
  let tfidf   = new TfIdf();

  _.forEach(jobList, function(job){
    tfidf.addDocument(job.snippet);
  });
  result.results = _.sortBy(jobList, function(job) {
    console.log(tfidf.tfidfs(query));
    return tfidf.tfidfs(query);
  });*/

  return result;
};

exports.has = function(query){
  return _.isUndefined(exports.findByQuery(query)) === false;
};

exports.save = function(result){
  if(_.isUndefined(result)) return;
  //console.log('has query', exports.has(result.query));
  if(exports.has(result.query) === false){

    db('jobs').push(result);
  }
};

exports.queries = function(){
  return _.map(exports.all(), function(jobs){
    return jobs.query;
  });
};
