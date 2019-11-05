'use strict';
//START OF moduleFunction() ============================================================
var moduleFunction = function(args) {
	const workingFunction = function(needle) {
		if (needle instanceof RegExp) {
			let found = false;
			this.forEach(item => {
				found = found || item.match(needle);
			});
			return found;
		} else {
			return this.includes(needle);
		}
	};
	const addToPrototype = () => {
		Array.prototype.qtIncludesRegex = workingFunction;
	};
	this.addToPrototype = addToPrototype;
};
//END OF moduleFunction() ============================================================
//module.exports = moduleFunction;
module.exports = new moduleFunction();
