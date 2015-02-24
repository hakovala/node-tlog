"use strict";

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
	pad: pad,
	fixedString: fixedString,
};
