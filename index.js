"use strict";

var fs = require("fs");
var path = require("path");

// Load in datastores

var datastoresPath = path.join(__dirname, "lib/datastores");
var datastores = {};

fs.readdirSync(datastoresPath).forEach(function (file) {
	var storeName = file.replace(/\.js$/,"");
	datastores[storeName] = require(path.join(datastoresPath, file));
});

// Load in test methods

var testMethodsPath = path.join(__dirname, "lib/methods");
var testMethods = {};

fs.readdirSync(testMethodsPath).forEach(function (file) {
	var testName = file.replace(/\.js$/,"");
	testMethods[testName] = require(path.join(testMethodsPath, file));
});

module.exports = {
	datastores: datastores,
	tests: testMethods
};