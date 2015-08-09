/**
* Todotask.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	description:'STRING',
  	dueDate:'DATE',
  	complete:{
  		type: 'boolean',
  		defaultsTo: false
  	},
  	priority:{
  		type: 'int',
  		defaultsTo: 1
  	},
  	type: 'STRING',
  	list: {
  		model:'todo'
  	}
  }
};

