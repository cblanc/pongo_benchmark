"use strict";

var path = require("path");
var util = require("util");
var Base = require(path.join(__dirname, "../datastoreBase.js"));
var redis = require("redis");

function Redis () {
	this.datastoreName = "Redis";
	Base.call(this, arguments);
}

util.inherits(Redis, Base);

Redis.prototype.setup = function (callback) {
	this.client = redis.createClient();
	this.cleanup(callback);
};

Redis.prototype.cleanup = function (callback) {
	this.client.flushdb(callback);
};

Redis.prototype.generateInsertQuery = function (document) {
	var self = this;
	var doc = JSON.stringify(document);
	return function (callback) {
		self.client.set(document.randomstring, doc, callback);	
	};
};
 
module.exports = new Redis();