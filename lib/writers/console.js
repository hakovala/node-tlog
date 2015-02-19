"use strict";

var util = require('util');
var misc = require('../misc');
var ms = require('ms');
var path = require('path');

var Writer = require('./writer');

var TAG_LEN = 20;
var LEVEL_LEN = 1;

var stderr = process.stderr;
var stdout = process.stdout;

function ConsoleWriter(options) {
	if (!(this instanceof ConsoleWriter))
		return new ConsoleWriter(options);

	options = options || {};
	this.tag_length = options.tag_length || TAG_LEN;
	this.colors = options.colors !== false;

	Writer.call(this, options);
}
util.inherits(ConsoleWriter, Writer);
module.exports = ConsoleWriter;

ConsoleWriter.prototype.write = function(log) {
	stdout.write(this.format(log) + '\n');
};

ConsoleWriter.prototype.format = function(log) {
	var tag = misc.fixedString(log.tag.name, this.tag_length, ' ');
	var level = ' ' + log.level.name.slice(0, LEVEL_LEN).toUpperCase() + ' ';
	var time = '+' + ms(log.time_diff);

	var message = util.format.apply(null, [log.message].concat(log.args));
	var trace = '';
	if (log.trace.length !== 0) {
		var filename = path.basename(log.trace[0].getFileName());
		var line = log.trace[0].getLineNumber();
		trace = '(' + filename + ':' + line + ')';
	}

	if (this.colors) {
		tag = misc.colorString(tag, log.tag.color);
		level = misc.colorString(level, log.level.color);
		time = misc.colorString(time, {text: 'green'});
		trace = misc.colorString(trace, {text: 'blackBright'});
	}

	return tag + ' ' + level + ' ' + message + ' ' + trace + ' ' + time;
};
