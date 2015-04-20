"use strict";

function DatastoreBase() {
	this.requiredMethods = [];
	this.host = "localhost";
	this.table = "pongotable";
	this.database = "pongodatabase";
	if (this.datastoreName === undefined) {
		throw new Error("Please define a name for the datastore");
	}
};

DatastoreBase.prototype.implementsAllMethods = function () {
	return this.requiredMethods.every(function (method) {
		return (this[method] && typeof this[method] === "function");
	});
};

DatastoreBase.prototype.setup = function (callback) {
	return callback(new Error("Setup method currently not implemented for " + this.datastoreName));
};

DatastoreBase.prototype.cleanup = function (callback) {
	return callback(new Error("Clean up method currently not implemented for " + this.datastoreName));
};

DatastoreBase.prototype.generateInsertQuery = function (callback) {
	return callback(new Error("Insert query generation method currently not implemented for " + this.datastoreName));
};

module.exports = DatastoreBase;