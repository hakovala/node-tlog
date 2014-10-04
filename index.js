"use strict";

var util = require('util');
var printf = require('printf');
var os = require('os');

nlog.SILENCE = 0;
nlog.ERROR = 2;
nlog.WARNING = 5;
nlog.DEBUG = 10;

nlog.LEVEL_LENGTH = 5;
nlog.TAG_LENGTH = 10;

var Format = {
	level: "[%(level)" + nlog.LEVEL_LENGTH + "s]",
	tag: "%(tag)" + nlog.TAG_LENGTH + "s",
	msg: "%(msg)s",
	trace: "(%(filename)s:%(line)d)"
};

var FORMAT_NORMAL = Format.level + ' ' + Format.tag + ': ' + Format.msg;
var FORMAT_TRACE = FORMAT_NORMAL + ' ' + Format.trace;

nlog.format = FORMAT_NORMAL;

var trace = false;
Object.defineProperty(nlog, 'trace', {
	get: function() { return trace; },
	set: function(value) {
		trace = !!value;
		nlog.format = (trace ? FORMAT_TRACE : FORMAT_NORMAL) + os.EOL;
	}
});

nlog.loggers = {};
var Enabled = [];

nlog.output = process.stdout;

function nlog(tag) {
	tag = tag || 'default';
	if (nlog.loggers[tag])
		return nlog.loggers[tag];

	function disabled() {
		return log;
	}

	function log(msg) {
		return log.d(msg);
	}

	log.print = log._print = function(level, msg) {
		var args = Array.prototype.slice.call(arguments, 2);
		var values = {
			tag: log.tag.substring(0, nlog.TAG_LENGTH),
			level: level.substring(0, nlog.LEVEL_LENGTH),
			msg: (args.length > 0 ? printf.apply(null, [msg].concat(args)) : msg),
			filename: 'hello',
			line: 123
		};
		printf(nlog.output, nlog.format, values);
		return log;
	};
	log.d = log._debug = log.print.bind(log, 'DEBUG');
	log.w = log._warning = log.print.bind(log, 'WARN');
	log.e = log._error = log.print.bind(log, 'ERROR');

	log.tag = tag;
	log._level = 0;
	log._enabled = true;

	function update() {
		log.d = (log._enabled && log._level >= nlog.DEBUG) ? log._debug : disabled;
		log.w = (log._enabled && log._level >= nlog.WARNING) ? log._warning : disabled;
		log.e = (log._enabled && log._level >= nlog.ERROR) ? log._error : disabled;
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

	nlog.loggers[tag] = log;

	return log;
}
module.exports = nlog;

nlog.enable = function(regexp) {
	var str = (typeof regexp == 'string') ? regexp : regexp.source;
	for (var i = 0, l = Enabled.length; i < l; i++) {
		if (Enabled[i].source == str) {
			// already enabled, nothing to do
			return;
		}
	}
	Enabled.push(regexp);
};

nlog.disable = function(regexp) {

};

nlog.enabled = function(tag) {

};

