"use strict";

var path = require("path");
var util = require("util");
var Base = require(path.join(__dirname, "../datastoreBase.js"));
var pg = require("pg");

function Postgresql () {
	this.datastoreName = "Postgresql";
	Base.call(this, arguments);
	this.conString = "postgres://postgres:@" + this.host + "/" + this.database;
	this.schema = {
		"id": "serial",
		"doc": "jsonb"
	}
}

util.inherits(Postgresql, Base);

function generateTableString (schema) {
	var output = [];
	for (var attr in schema) {
		if (schema.hasOwnProperty(attr)) {
			output.push(attr + " " + schema[attr]);
		}
	}
	return output.join(", ");
}

Postgresql.prototype.setup = function (callback) {
	var self = this;
	pg.connect(self.conString, function (error, client, done) {
		if (error) return callback(error);
		self.client = client;
		self.cleanup(function (error) {
			if (error) return callback(error);
			self.createTable(callback);
		});
	});
};

Postgresql.prototype.createTable = function (callback) {
	var query = ["CREATE TABLE", this.table, "(", generateTableString(this.schema),")"].join(" ");
	this.client.query(query, callback);
};

Postgresql.prototype.cleanup = function (callback) {
	var query = ["DROP TABLE if exists", this.table].join(" ");
	this.client.query(query, callback);
};

Postgresql.prototype.generateInsertQuery = function (document) {
	var self = this;
	var doc = JSON.stringify(document);
	return function (callback) {
		self.client.query(["INSERT INTO", self.table, "(doc) VALUES ('", doc, "')"].join(" "), callback);
	};
};

module.exports = new Postgresql();