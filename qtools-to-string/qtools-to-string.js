'use strict';
//START OF moduleFunction() ============================================================
var moduleFunction = function(args) {

const toType = function(obj) {
		if (obj === null) {
			return 'null';
		} else if (typeof obj == 'undefined') {
			return 'undefined';
		} else {
			return {}.toString
				.call(obj)
				.match(/\s([a-z|A-Z]+)/)[1]
				.toLowerCase();
		}
	};
	
	
	const workingFunction = function(args) {
	
	switch(toType(this)){
	
	case 'array':
		let separator=', '
		if (typeof(args)=='string'){
			separator=args;
		}
		else if (typeof(args)=='object'){
			separator=args.separator;
		}
		else if (typeof(args)!='undefined') {
			throw `qtToString() says, string or {separator:'xxx'} are only valid arguments`
		}
		const tmp=this.join(separator).replace(new RegExp(`${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '');
		return tmp;
	break;
	default:
		return this.toString();
	}
	
	
	}
	
	
	
	
	const addToPrototype = () => {
		Object.prototype.qtToString = workingFunction;
	};
	this.addToPrototype = addToPrototype;
};
//END OF moduleFunction() ============================================================
//module.exports = moduleFunction;
module.exports = new moduleFunction();
