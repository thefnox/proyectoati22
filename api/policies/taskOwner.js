module.exports = function(req, res, next) {

	var taskId = req.param('id');

	if (taskId){
		Task.findOne({
			id     : taskId
		}, function (err, task) {
			if (task){
				if (task.owner === req.user.id) return next();
				else return res.forbidden('You are not permitted to perform this action.');
			}
			else{
				return res.forbidden('You are not permitted to perform this action.');
			}
		});
	}
};
