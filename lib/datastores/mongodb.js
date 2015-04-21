"use strict";

var path = require("path");
var util = require("util");
var Base = require(path.join(__dirname, "../datastoreBase.js"));
var MongoClient = require("mongodb").MongoClient;

function Mongodb () {
	this.datastoreName = "MongoDB";
	Base.call(this, arguments);
	this.conString = "mongodb://" + this.host + ":27017/" + this.table;
}

util.inherits(Mongodb, Base);

Mongodb.prototype.setup = function (callback) {
	var self = this;
	MongoClient.connect(self.conString, function (error, client) {
		if (error) return callback(error);
		self.collection = client.collection(self.table);
		self.cleanup(callback);
	});
};

Mongodb.prototype.cleanup = function (callback) {
	this.collection.remove({}, callback);
};

Mongodb.prototype.generateInsertQuery = function (document) {
	var self = this;
	return function (callback) {
		self.collection.insert([document], callback);
	};
};

module.exports = new Mongodb();