'use strict';
const qtoolsGen = require('qtools');
const qtools = new qtoolsGen(module, { updatePrototypes: true });

//START OF moduleFunction() ============================================================

var moduleFunction = function(args) {
	/* 

asynchronousPipe() takes an array of asyncronous function and executes them
in sequence. As each completes, the next is called with the return result of the
previous function.

The parameters are:

	workList: an array of functions
	initialValue:	optional initial value passed to the first function
	callback:		optional function called after all the other functions are finished

The workList functions must have the signature:

	(args, next)={
		const result= "some functionOf(args), probably the result of an I/O function";
		next(err, result); //mandatory
	}

As of 6/7/19, there is a special value of err, skipRestOfPipe, eg:

next('skipRestOfPipe', result);

This will do as the symbol says, skip the rest of the pipe. It serves the role of 'continue'
in loops. Practically speaking, it calls the callback with the current value of result and no error.

The optional callback function is called as:

	callback(err, result);

asynchronousPipe() does not return anything.

 */

	// asyncPipe(workList, [initialValue,] callback);
	const asynchronousPipe = (...args) => {
		const workList = args[0];
		const callback = args[args.length - 1];

		let initial;
		if (args.length == 3) {
			initial = args[1];
		}

		const recursion = (err, result, workListInx) => {
			if (err) {
				if (err == 'skipRestOfPipe') {
					callback('skipRestOfPipe', result);
					return;
				} else {
					callback(err, result);
					return;
				}
			}

			if (workListInx > workList.length - 1) {
				if (typeof callback == 'function') {
					callback('', result);
				}
				return;
			}
			workList[workListInx](result, (err, result) => {
				recursion(err, result, workListInx + 1);
			});
		};
		recursion('', initial, 0);
	};
	const taskListPlus = function() {
		const taskList = [];
		const hiddenArgsName = 'globalArgs';

		const addOptions = options => {
			if (options.debug) {
				switch (options.debug) {
					case 'properties':
						//{debug:'properties', label:'identifier'}
						taskList.push((args, next) => {
							qtools.logDebug(
								`\nLIST: args (${options.label ? options.label : ''}) =======`
							);
							qtools.listProperties(args);
							qtools.logDebug('======= args\n');
						});
						break;
					case 'fileMarker':
						//{debug:'fileMarker', label:'identifier'}
						taskList.push((args, next) => {
							qtools.logDebug(
								`\n=-========= (${
									options.label ? options.label : ''
								}) =======\n`
							);
						});
						break;
				}
			}
		};

		this.push = function(item, propertyList, options) {
			if (qtools.toType(propertyList) == 'array') {
				taskList.push(this.reduceToLocalScope(propertyList));
			}

			if (options) {
				addOptions(options);
			}
			taskList.push(item);
			this.length = taskList.length;
		};

		this.addFromDelegate = function(
			targetFunction,
			propertyList,
			options = {}
		) {
			if (qtools.toType(propertyList) == 'array') {
				taskList.push(this.reduceToLocalScope(propertyList));
			}

			targetFunction();
		};

		this.getList = function() {
			return taskList;
		};

		this.list = () => {
			taskList.forEach(item =>
				console.log(item.toString() + '\n-------------\n')
			);
		};

		const isScopeBad = (
			args,
			list,
			strict = false,
			originatingLine = 'no originating line given'
		) => {
			const missing = list.filter(name => typeof args[name] == 'undefined');
			const extra = Object.keys(args).filter(name => !list.includes(name));
			let result = '';

			const missingString = missing.join(', ');
			if (missingString && missingString != `${hiddenArgsName}`) {
				result = `isScopeBad() found missing parameters: ${missingString} `;
			}

			const extraString = extra
				.join(', ')
				.replace(new RegExp(`(, )*${hiddenArgsName}*`), '');
			if (strict && extraString && extraString != hiddenArgsName) {
				result += `isScopeBad() found extra parameters: ${extraString} `;
			}

			if (result) {
				result = `${result} ${originatingLine}`;
				qtools.logError(result);
			}
			return result ? result : false;
		};

		this.returnGlobalArgs = args => {
			const newArgs = Object.assign({}, args[hiddenArgsName], args);
			delete newArgs[hiddenArgsName];
			return newArgs;
		};

		this.getArgsValue = (args, nameList) => {
			return nameList.reduce((result, name) => {
				result[name] = args[hiddenArgsName][name]
					? args[hiddenArgsName][name]
					: args[name];
				return result;
			}, {});
		};

		this.enforceScope = (propertyList, strict = true) => {
			let e = new Error();
			const originatingLine = e.stack.split('\n')[2];
			taskList.push((args, next) => {
				next(isScopeBad(args, propertyList, strict, originatingLine), args);
			});
		};

		this.reduceToLocalScope = requiredPropertyList => (args, next) => {
			const localCallback = (err, cleanedArgs) => {
				next(err, cleanedArgs);
			};

			if (args[hiddenArgsName]) {
				const tmpArgs = Object.assign({}, args[hiddenArgsName], args);
				delete tmpArgs[hiddenArgsName];
				args = tmpArgs; //prevent recursing down globalArgs
			}

			const validFiles = true;
			const cleanedArgs = {};

			requiredPropertyList.forEach(item => {
				cleanedArgs[item] = args[item];
			});

			const missingElements = requiredPropertyList
				.filter(item => typeof cleanedArgs[item] == 'undefined')
				.join(', ');
			cleanedArgs[hiddenArgsName] = args;
			localCallback(
				missingElements
					? `MISSING ELEMENTS: ${missingElements} (by reduceToLocalScope())`
					: '',
				cleanedArgs
			);
		};
		this.restoreGlobalScope = () => (args, next) => {
			const newArgs = Object.assign({}, args[hiddenArgsName], args);
			delete newArgs[hiddenArgsName];
			next('', newArgs);
		};
		return this;
	};

	return {
		pipeRunner:asynchronousPipe,
		asynchronousPipe,
		taskListPlus
	};
};

//END OF moduleFunction() ============================================================

module.exports = moduleFunction;
//module.exports = new moduleFunction();
