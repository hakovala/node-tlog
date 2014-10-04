"use strict";

var util = require('util');
var printf = require('printf');
var os = require('os');

tlog.SILENCE = 0;
tlog.ERROR = 2;
tlog.WARNING = 5;
tlog.DEBUG = 10;

tlog.LEVEL_LENGTH = 5;
tlog.TAG_LENGTH = 10;

var Format = {
	level: "[%(level)" + tlog.LEVEL_LENGTH + "s]",
	tag: "%(tag)" + tlog.TAG_LENGTH + "s",
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
			tag: log.tag.substring(0, tlog.TAG_LENGTH),
			level: level.substring(0, tlog.LEVEL_LENGTH),
			msg: (args.length > 0 ? printf.apply(null, [msg].concat(args)) : msg),
			filename: 'hello',
			line: 123
		};
		printf(tlog.output, tlog.format, values);
		return log;
	};
	log.d = log._debug = log.print.bind(log, 'DEBUG');
	log.w = log._warning = log.print.bind(log, 'WARN');
	log.e = log._error = log.print.bind(log, 'ERROR');

	log.tag = tag;
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

