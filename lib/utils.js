"use strict";

exports.elapsedTime = function (startTime) {
  return process.hrtime(startTime); 
};

var timePrecision = 3;
exports.prettyPrintTime = function (elapsedTime) {
  return elapsedTime[0] + " s, " + (elapsedTime[1]/1000000).toFixed(timePrecision) + " ms";
};
