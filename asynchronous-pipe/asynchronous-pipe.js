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
			callback(err, result);
			return;
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

module.exports = asynchronousPipe;
