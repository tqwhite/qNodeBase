'use strict';
var events = require('events'),
	util = require('util'),
	environmentChanges = require('environmentChanges'),
	addBaseFunctions = require('qtoolsBase'),
	nodeManipulation = require('nodeManipulation'),
	lodash = require('lodash');

//START OF moduleFunction() ============================================================

var moduleFunction = function(employer) {
	events.EventEmitter.call(this);
	var self = this,
		forceEvent = function(eventName, outData) {
			this.emit(eventName, {
				eventName: eventName,
				data: outData
			});
		}

		//INITIALIZE OBJECT ====================================

	addBaseFunctions(this);

	if (typeof (employer) == 'object') {
		this.employerFilePath = employer.filename ? employer.filename : '';

		var split = this.employerFilePath.split('/');

		if (split.length) {
			this.employerFilename = split[split.length - 1];
		} else {
			this.employerFilename = '';
		}
	}


	this._=lodash;

	this.ping = function() {
		//remember, 'this' refers to employer object because of assignment in object. could be handy.
		return {
			employer: self.employerFilename,
			qtoolsFile: module.filename
		};
	}

	this.listNames = function() {
		for (var i in this) {
			console.log(i);
		}
		for (var i = 0, len = environmentChanges.length; i < len; i++) {
			var element = environmentChanges[i];
			console.log(element);
		}

	}

	self.extend(this, nodeManipulation)

	//BUILD RETURN OBJECT ====================================

	this.forceEvent = forceEvent;


	return this;
};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports = moduleFunction;

