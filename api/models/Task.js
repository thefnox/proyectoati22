/**
* Task.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	description: {
  		type: 'string',
  		required: true,
  		size: 255
  	},
  	datePlanned: {
  		type: 'datetime'
  	},
  	priority: {
  		type: 'integer',
  		defaultsTo: 1
  	},
  	taskType: {
  		type: 'string',
  		size: 255,
      defaultsTo: "Unsorted"
  	},
  	done: {
  		type: 'boolean',
  		defaultsTo: false
  	},
  	owner:{
  		model: 'user'
  	}
  }
};

