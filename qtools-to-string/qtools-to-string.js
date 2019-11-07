'use strict';
//START OF moduleFunction() ============================================================
var moduleFunction = function(args) {

// console.log("['a', 'b'].qtToString()="+['a', 'b'].qtToString()+" [config-command-line-manager.js.moduleFunction]");


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
		const tmp=this.join(separator).replace(new RegExp(`${separator}$`), '');
		return tmp;
	break;
	default:
		return this.toString();
	}
	
	
	}
	
		
	const addToPrototype = (target, name, workingFunction) => () => {
		if (typeof target.prototype[name] == 'undefined') {
			Object.defineProperty(target.prototype, name, {
				value: workingFunction,
				writable: false,
				enumerable: false
			});
		}
	};
	this.addToPrototype = addToPrototype(Array, 'qtToString', workingFunction);
	

};
//END OF moduleFunction() ============================================================
//module.exports = moduleFunction;
module.exports = new moduleFunction();
