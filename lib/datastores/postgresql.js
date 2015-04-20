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
	var clearTableQuery = ["DROP TABLE if exists", self.table].join(" ");
	var createTableQuery = ["CREATE TABLE", self.table, "(", generateTableString(self.schema),")"].join(" ");
	pg.connect(self.conString, function (error, client, done) {
		if (error) return callback(error);
		self.client = client;
		console.log("Setting up test database...");
		client.query(clearTableQuery, function (error) {
			if (error) return callback(error);
			client.query(createTableQuery, function (error, result) {
				console.log("Done");
				return callback(error, result);
			});
		});
	});
};

Postgresql.prototype.cleanup = function (callback) {
	var self = this;
	var clearTableQuery = ["DROP TABLE if exists", self.table].join(" ");
	console.log("Cleaning up database...");
	self.client.query(clearTableQuery, function (error) {
		console.log("Done");
		return callback(error);
	});
};

Postgresql.prototype.generateInsertQuery = function (document) {
	var self = this;
	var doc = JSON.stringify(document);
	return function (callback) {
		self.client.query(["INSERT INTO", self.table, "(doc) VALUES ('", doc, "')"].join(" "), function (error) {
			return callback(error);
		});
	};
};

module.exports = new Postgresql();