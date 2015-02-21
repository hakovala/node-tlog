"use strict";

var fs = require('fs');
var path = require('path');
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

// Read configs from file
var config_dir = module.parent.filename;
var config_file;
// search config file from parent directories
while ((config_dir = path.dirname(config_dir)) && config_dir !== '/') {
	var filepath = config_dir + '/tlog.json';
	if (fs.existsSync(filepath)) {
		config_file = filepath;
		break;
	}
}

var config;
try {
	config = JSON.parse(fs.readFileSync(config_file));
} catch (e) {
	config = {};
}

// normalize level string to number
function normalizeLevel(level) {
	if (typeof level === 'string') {
		level = Level[level.toUpperCase()];
	}
	return level;
}

// normalize configs
config.level = normalizeLevel(config.level) || Level.INFO;

// cache loggers
var loggers = {};
var writers = [ new ConsoleWriter() ];

var current_tag_color = 0;
var tag_colors = ['white', 'green', 'blue', 'cyan', 'gray', 'magenta'];

function nextTagColor() {
	return tag_colors[current_tag_color++ % tag_colors.length];
}

function matchTag(tag) {
	if (!config.tags)
		return null;

	var tagList = Object.keys(config.tags);
	var best = tagList.reduce(function(prev, current, i, arr) {
		// if current tag is longer and tag starts with it,
		// then it's a better match
		if (tag.indexOf(current) === 0) {
			if (!prev || prev.length <= current.length) {
				prev = current;
			}
		}
		return prev;
	}, undefined);

	return best;
}

function getTagLevel(tag) {
	var best = matchTag(tag);
	return best ? normalizeLevel(config.tags[best].level) : null;
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
	config.level = level;
};

// Logger object
function Logger(tag, options) {
	if (!(this instanceof Logger))
		return new Logger(tag);

	this.tag = tag;
	this.tag_color = nextTagColor();
	this.level = getTagLevel(tag);

	var last_call;

	this.log = function(level, msg) {
		if (this.level === null && level < config.level)
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

	this.spy = function(event_emitter) {
		var self = this;
		event_emitter._emit = event_emitter.emit;
		event_emitter.emit = function(event) {
			self.d('event:', event);
			event_emitter._emit.apply(event_emitter, arguments);
		};
	};
	this.removeSpy = function(event_emitter) {
		if (event_emitter._emit) {
			event_emitter.emit = event_emitter._emit;
			event_emitter._emit = undefined;
		}
	};

	this.Level = Level;
}
module.exports.Logger = Logger;
