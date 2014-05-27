'use strict';
var events = require('events'), 
	util=require('util'),
//	require('environmentChanges'),
	addBaseFunctions=require('qtoolsBase');

//START OF moduleFunction() ============================================================

var moduleFunction=function(employer){
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
		
		if (typeof(employer)=='object'){
			this.employerFilePath=employer.filename?employer.filename:'';
			
			var split=this.employerFilePath.split('/');

			if (split.length){
				this.employerFilename=split[split.length-1];
			}
			else{
				this.employerFilename='';
			}	
		}
		


			
		//BUILD RETURN OBJECT ====================================

		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;