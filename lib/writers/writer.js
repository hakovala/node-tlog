"use strict";

function Writer() {
	// base writer implementation
}
module.exports = Writer;

Writer.prototype.write = function(log) {
	throw new Error('Missing implementation');
};

Writer.prototype.format = function(obj) {
	throw new Error('Missing implementation');
};
