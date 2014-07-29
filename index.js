"use strict";

var fs = require("fs");

var Manifest = function(opts){
  var self = this;
  var route = opts.route || "/manifest"
  var savePath = __dirname+"/._storedData.json";
  var save = function(){
    fs.writeFile(savePath, self.getJSON(), function(err){
      if(err) console.error(err);
    });
  };
  
  var manifestObj = {
    cache: opts.cache || {},
    network: opts.network || {},
    fallback: opts.fallback || {}
  };
  if(opts.persistent && fs.existsSync(savePath)) {
    manifestObj = JSON.parse(fs.readFileSync(savePath));
  }

  var removeEverywhere = function(url){
    delete manifestObj.cache[url];
    delete manifestObj.network[url];
    delete manifestObj.fallback[url];
  };
  this.cache = function(url){
    removeEverywhere(url);
    manifestObj.cache[url] = url;
    if(opts.persistent) save();
    return this;
  };
  this.network = function(url){
    removeEverywhere(url);
    manifestObj.network[url] = url;
    if(opts.persistent) save();
    return this;
  };
  this.fallback = function(url, fallbackUrl){
    removeEverywhere(url);
    manifestObj.fallback[url] = fallbackUrl;
    if(opts.persistent) save();
    return this;
  };

  this.removeCache = function(url){
    delete manifestObj.cache[url];
    if(opts.persistent) save();
    return this;
  };
  this.removeNetwork = function(url){
    delete manifestObj.network[url];
    if(opts.persistent) save();
    return this;
  };
  this.removeFallback = function(url){
    delete manifestObj.fallback[url];
    if(opts.persistent) save();
    return this;
  };
  this.getJSON = function(){
    return JSON.stringify(manifestObj);
  };
  this.parse = function(){
    var arr = ["CACHE MANIFEST"];
    
    var hash;
    
    arr.push("CACHE:");
    for(hash in manifestObj.cache) {
      arr.push(manifestObj.cache[hash]);
    }
    
    arr.push("NETWORK:");
    for(hash in manifestObj.network) {
      arr.push(manifestObj.network[hash]);
    }
    
    arr.push("FALLBACK:");
    for(hash in manifestObj.fallback) {
      arr.push(hash+" "+manifestObj.fallback[hash]);
    }
    
    return arr.join("\n");
  };
  this.middleware = function(req, res, next){
    if(req.url === route) {
      var mf = self.parse();
      res.writeHead(200, {
        "Content-Length": mf.length,
        "Content-Type": "text/cache-manifest"
      });
      res.end(mf);
    } else {
      next();
    }
  };
};

module.exports = Manifest;