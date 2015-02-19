"use strict";

var misc = require('./lib/misc');
var stackTrace = require('stack-trace');

var ConsoleWriter = require('./lib/writers/console');

// Log levels
var Level = {
	DEBUG: 10,
	INFO: 20,
	WARNING: 30,
	ERROR: 40,
	SILENT: 9999,
	options: {},
};

// Log level options
var default_level = {name: 'unknown'};
Level.options[Level.DEBUG]   = {name: 'debug'  , color: {text: 'white', background: 'bgBlue'}};
Level.options[Level.INFO]    = {name: 'info'   , color: {text: 'black', background: 'bgWhite'}};
Level.options[Level.WARNING] = {name: 'warning', color: {text: 'black', background: 'bgYellow'}};
Level.options[Level.ERROR]   = {name: 'error'  , color: {text: 'black', background: 'bgRed'}};

var loggers = {};
var writers = [ new ConsoleWriter() ];

var global_level = Level.INFO;

var current_tag_color = 0;
var tag_colors = ['white', 'green', 'blue', 'cyan', 'gray', 'magenta'];

function nextTagColor() {
	return tag_colors[current_tag_color++ % tag_colors.length];
}

// Create new Logger with tag
module.exports = function(tag) {
	if (!loggers[tag]) {
		loggers[tag] = new Logger(tag);
	}
	return loggers[tag];
};

module.exports.loggers = loggers;
module.exports.writers = writers;
module.exports.Level = Level;

/**
 * Set global log level
 * @param {integer} level log level
 */
module.exports.setLevel = function(level) {
	global_level = level;
};

// Logger object
function Logger(tag, options) {
	if (!(this instanceof Logger))
		return new Logger(tag);

	this.tag = tag;
	this.tag_color = nextTagColor();
	this.level = null;

	var last_call;

	this.log = function(level, msg) {
		if (this.level === null && level < global_level)
			return;
		if (level < this.level)
			return;

		var now = +new Date();
		var diff = last_call ? now - last_call : 0;
		last_call = now;

		var log_obj = {
			time: now,
			time_diff: diff,
			tag: {name: this.tag, color: { text: this.tag_color }},
			level: Level.options[level] || default_level,
			message: msg,
			args: Array.prototype.slice.call(arguments, 2),
			trace: stackTrace.get(this.log),
		};

		for (var i = 0; i < writers.length; i++) {
			writers[i].write(log_obj);
		}
	}.bind(this);

	this.d = this.log.bind(this, Level.DEBUG);
	this.i = this.log.bind(this, Level.INFO);
	this.w = this.log.bind(this, Level.WARNING);
	this.e = this.log.bind(this, Level.ERROR);

	this.Level = Level;
}
module.exports.Logger = Logger;
