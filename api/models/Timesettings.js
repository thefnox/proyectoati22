/**
* Timesettings.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	morning: {
  		type: 'datetime',
  	},
  	evening: {
  		type: 'datetime',
  	},
  	night: {
  		type: 'datetime',
  	},
  	tomorrow:{
  		type: 'datetime'
  	},
  	aftertomorrow:{
  		type: 'datetime'
  	},
  	nextweek:{
  		type: 'datetime'
  	},
  	owner:{
  		model:'user'
  	}
  }
};

