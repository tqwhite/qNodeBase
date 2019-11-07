'use strict';

//START OF moduleFunction() ============================================================

var moduleFunction = function(args) {
	const addToPrototype = () => {
		const setStart = function(startValue) {
			return new IterationThing({
				startValue,
				incrementValue: this.incrementValue ? this.incrementValue : 1,
				endValue: this.endValue ? this.endValue : this
			});
		};

		const setIncrement = function(incrementValue) {
			return new IterationThing({
				startValue: this.startValue ? this.startValue : 0,
				incrementValue,
				endValue: this.endValue ? this.endValue : this
			});
		};

		const iterator = function(callback) {
			const startValue = this.startValue ? this.startValue : 0;
			const incrementValue = this.incrementValue ? this.incrementValue : 1;
			const endValue = this.endValue ? this.endValue : this;

			const out = [];
			for (let i = startValue; i < endValue; i = i + incrementValue) {
				if (typeof callback == 'function') {
					out.push(callback(i));
				} else {
					out.push(i);
				}
			}
			return out;
		};

		function IterationThing(inObj) {
			for (var i in inObj) {
				var element = inObj[i];
				this[i] = element;
			}
		}
		
		if (typeof(Number.prototype.qtIterate)=='undefined'){
			Object.defineProperty(Number.prototype, 'qtIterate', {
				value: iterator,
				writable: false,
				enumerable:false
			});
			
			Object.defineProperty(Number.prototype, 'qtStart', {
				value: setStart,
				writable: false,
				enumerable:false
			});
			
			Object.defineProperty(Number.prototype, 'qtIncrement', {
				value: setIncrement,
				writable: false,
				enumerable:false
			});
		}
	};

	this.addToPrototype = addToPrototype;
};

//END OF moduleFunction() ============================================================

//module.exports = moduleFunction;
module.exports = new moduleFunction();

