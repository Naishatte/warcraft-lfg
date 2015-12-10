"use strict";

//Defines dependencies
var applicationStorage = process.require("api/applicationStorage");
var env = process.env.NODE_ENV || "dev";
var config = process.require("config/config."+env+".json");
var async = require('async');

module.exports.insertOrUpdateBnet = function (region,name,bnet,callback) {
    var database = applicationStorage.getMongoDatabase();

    //Check for required attributes
    if(region == null){
        callback(new Error('Field region is required in GuildUpdateModel'));
        return;
    }
    if(name == null){
        callback(new Error('Field name is required in GuildUpdateModel'));
        return;
    }

    //Force region to lower case
    region = region.toLowerCase();

    var realm ={};
    realm.region = region;
    realm.name = name;
    realm.updated = new Date().getTime();

    bnet.updated=new Date().getTime();

    realm.bnet = bnet;

    //Create or update guildUpdate
    database.insertOrUpdate("realms", {region:region,name:name} ,null ,realm, function(error,result){
        callback(error, result);
    });
};

module.exports.get = function(realmFilters, callback){
    var criteria = {};
    if (realmFilters.region && realmFilters.region.length > 0){
        criteria.region = {'$in':realmFilters.region}
    }
    if (realmFilters.locale && realmFilters.locale.length > 0){
        criteria['bnet.locale'] = {'$in':realmFilters.locale}
    }
    if (realmFilters.timezone && realmFilters.timezone.length > 0){
        criteria['bnet.timezone'] = {'$in':realmFilters.timezone}
    }
    console.log(criteria);
    var database = applicationStorage.getMongoDatabase();
    database.find("realms",criteria, {name:1,region:1,"bnet.connected_realms":1,"bnet.locale":1,"bnet.timezone":1}, -1,{name:1,region:1}, function(error,result){
        callback(error, result);
    });
};
