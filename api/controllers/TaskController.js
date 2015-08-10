/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		Task.find({
			owner     : req.user.id
		}, function(err, tasks){
			res.json(tasks)
		})
	}
};

