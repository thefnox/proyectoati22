module.exports = function(req, res, next) {

	// User is allowed, proceed to the next policy, 
	// or if this is the last policy, the controller
	if (req.param('userid') != undefined){
		if (req.param('userid') != req.user.id) return res.forbidden('You are not permitted to perform this action.');
		else return next();
	}
	if (req.param('owner') != undefined){
		if (req.param('owner') != req.user.id) return res.forbidden('You are not permitted to perform this action.');
		else return next();
	}

	Task.findOne({
		owner     : req.user.id
	}, function (err, task) {
		if (task){
			if (task.owner === req.user.id) return next();
		}
		else{
			return next();
		}
	});

	// User is not allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	return res.forbidden('You are not permitted to perform this action.');
};
