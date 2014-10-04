"use strict";

var util = require('util');
var printf = require('printf');
var os = require('os');
var colors = require('colors');

tlog.SILENCE = 0;
tlog.ERROR = 2;
tlog.WARNING = 5;
tlog.DEBUG = 10;

tlog.levels = {};
tlog.levels[tlog.DEBUG]   = {	name: 'debug', color: 'blue' };
tlog.levels[tlog.WARNING] = {	name: 'warn', color: 'yellow' };
tlog.levels[tlog.ERROR]   = {	name: 'error', color: 'red' };

var current_color = 0;
tlog.colors = true;
tlog.tag_colors = [ 'white', 'green', 'blue', 'cyan', 'gray', 'magenta' ];

tlog.LEVEL_LENGTH = 5;
tlog.TAG_LENGTH = 10;

var Format = {
	level: "[%(level)s]",
	tag: "%(tag)s",
	msg: "%(msg)s",
	trace: "(%(filename)s:%(line)d)"
};

var FORMAT_NORMAL = Format.level + ' ' + Format.tag + ': ' + Format.msg;
var FORMAT_TRACE = FORMAT_NORMAL + ' ' + Format.trace;

tlog.format = FORMAT_NORMAL;

var trace = false;
Object.defineProperty(tlog, 'trace', {
	get: function() { return trace; },
	set: function(value) {
		trace = !!value;
		tlog.format = (trace ? FORMAT_TRACE : FORMAT_NORMAL) + os.EOL;
	}
});

tlog.loggers = {};
var Enabled = [];

tlog.output = process.stdout;

function next_tag_color() {
	return tlog.tag_colors[current_color++ % tlog.tag_colors.length];
}

function prepend_string(str, len, c) {
	c = c || ' ';
	if (str.length > len)
		return str.substring(0, len);
	if (str.length < len)
		return Array(len - str.length + 1).join(c) + str;
	return str;
}

function append_string(str, len, c) {
	c = c || ' ';
	if (str.length > len)
		return str.substring(0, len);
	if (str.length < len)
		return str + Array(len - str.length + 1).join(c);
	return str;
}

function tlog(tag) {
	tag = tag || 'default';
	if (tlog.loggers[tag])
		return tlog.loggers[tag];

	function disabled() {
		return log;
	}

	function log(msg) {
		return log.d(msg);
	}

	log.print = log._print = function(level, msg) {
		var args = Array.prototype.slice.call(arguments, 2);

		var values = {
			tag: prepend_string(log.tag, tlog.TAG_LENGTH),
			level: prepend_string(tlog.levels[level].name, tlog.LEVEL_LENGTH),
			msg: (args.length > 0 ? printf.apply(null, [msg].concat(args)) : msg),
			// TODO: correct trace
			filename: 'hello',
			line: 123
		};
		var format = tlog.format;

		if (tlog.colors && log.colors) {
			values.level = values.level[tlog.levels[level].color]
			values.msg = values.msg[log._color];
		}
		printf(tlog.output, format, values);
		return log;
	};
	log.d = log._debug = log.print.bind(log, tlog.DEBUG);
	log.w = log._warning = log.print.bind(log, tlog.WARNING);
	log.e = log._error = log.print.bind(log, tlog.ERROR);

	log.tag = tag;
	log.colors = tlog.colors;
	log._color = next_tag_color();
	log._level = 0;
	log._enabled = true;

	function update() {
		log.d = (log._enabled && log._level >= tlog.DEBUG) ? log._debug : disabled;
		log.w = (log._enabled && log._level >= tlog.WARNING) ? log._warning : disabled;
		log.e = (log._enabled && log._level >= tlog.ERROR) ? log._error : disabled;
	}

	Object.defineProperties(log, {
		'enabled': {
			get: function() {
				return this._enabled;
			},
			set: function(value) {
				this._enabled = value;
				update();
			}
		},
		'level': {
			get: function() {
				return this._level;
			},
			set: function(value) {
				this._level = value;
				update();
			}
		}
	});

	tlog.loggers[tag] = log;

	return log;
}
module.exports = tlog;

tlog.enable = function(regexp) {
	var str = (typeof regexp == 'string') ? regexp : regexp.source;
	for (var i = 0, l = Enabled.length; i < l; i++) {
		if (Enabled[i].source == str) {
			// already enabled, nothing to do
			return;
		}
	}
	Enabled.push(regexp);
};

tlog.disable = function(regexp) {

};

tlog.enabled = function(tag) {

};

