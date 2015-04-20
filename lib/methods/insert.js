"use strict";

var DESCRIPTION = "Inserting a large volume of records into database";

// Procedure outline
//
// - Prepare database
// - Generate list of documents to insert
// - Generate queue of insert instructions
// - Start timer and execute instruction queue
// - Report time taken
// - Cleanup database

var async = require("async");
var path = require("path");
var utils = require(path.join(__dirname, "../utils.js"));
var generator = require(path.join(__dirname, "../generator.js"));

var MAX_RECORDS = 10000;

var datastore, options, documents, insertInstructions, timer;

// Creates 1m documents to be inserted
// Creates functions, which when invoked, insert a document into the datastore
var generateInsertInstructions = function () {
	documents = [];

	for (var i = 0; i < MAX_RECORDS; i++) {
		documents.push({
			randomstring: generator.randomString(20),
			randominteger: Math.floor(Math.random() * 1000000000)
		});
	}

	return insertInstructions = documents.map(function (document) {
		return datastore.generateInsertQuery(document);
	});
};

module.exports = {
	description: DESCRIPTION,
	run: function (ds, o, callback) {
		datastore = ds;
		options = o;
		console.log("\nThis test will insert", MAX_RECORDS, "documents into", datastore.datastoreName, "\n");
		console.log("Generating test data...");
		generateInsertInstructions();
		console.log("Done");
		datastore.setup(function (error) {
			if (error) return callback(error);
			// Start timer
			timer = process.hrtime();
			console.log("Now inserting", insertInstructions.length, "documents...");
			async.series(insertInstructions, function (error) {
				if (error) return callback(error);
				console.log("Done")
				var elapsedTime = utils.elapsedTime(timer);
				console.log("\nResults:");
				console.log("Total time taken for", MAX_RECORDS, "records:", utils.prettyPrintTime(elapsedTime), "\n");
				datastore.cleanup(callback);
			});
		});
	}
};