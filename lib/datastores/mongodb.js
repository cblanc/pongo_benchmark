"use strict";

var path = require("path");
var util = require("util");
var Base = require(path.join(__dirname, "../datastoreBase.js"));
var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");

function Mongodb () {
	this.datastoreName = "MongoDB";
	Base.call(this, arguments);
	this.conString = "mongodb://" + this.host + ":27017/" + this.table;
	this.Model = mongoose.model(this.table, { randomstring: String, randomnumber: Number });
	mongoose.connect(this.conString);
}

util.inherits(Mongodb, Base);

Mongodb.prototype.setup = function (callback) {
	this.cleanup(callback);
};

Mongodb.prototype.cleanup = function (callback) {
	this.Model.remove({}, callback);
};

Mongodb.prototype.generateInsertQuery = function (document) {
	var self = this;
	var table = this.table;
	return function (callback) {
		new self.Model(document).save(callback);
	};
};

module.exports = new Mongodb();