var chalk = require('chalk');
var moment = require('moment');

var chalkLog = function(s, chalkColor) {
  console.log(moment().format("D MMM HH:mm:ss") + " - " + chalkColor(s));
}

var logBlue = function(s) { return chalkLog(s, chalk.blue); }
var logRed = function(s) { return chalkLog(s, chalk.red); }
var logGreen = function(s) { return chalkLog(s, chalk.green); }

module.exports = {
  blue: logBlue,
  red: logRed,
  green: logGreen
}
