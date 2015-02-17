"use strict";

var clc = require('cli-color');

function colorString(string, color) {
	if (!color) return string;

	var out = string;
	if (color.text) {
		out = clc[color.text](out);
	}
	if (color.background) {
		out = clc[color.background](out);
	}
	if (color.styles) {
		var styles = color.styles;
		if (!Array.isArray(styles))
			styles = [color.styles];
		for (var i = 0; i < styles.length; i++) {
			out = clc[styles[i]](out);
		}
	}
	return out;
}

function pad(input, length, character, direction) {
	character = character || 0;
	input = (input || character) + '';
	var padding = new Array((++length || 3) - input.length).join(character);
	return direction ? input + padding : padding + input;
}

function fixedString(input, len, character) {
	character = character || ' ';
	input = pad(input, len, character);
	return pad(input, len, character).slice(-len);
}

module.exports = {
	colorString: colorString,
	pad: pad,
	fixedString: fixedString,
};
