/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	changePassword: function(req, res){
		var oldpass = req.param("oldpassword");
		var newpass = req.param("newpassword");
		User.findOne({ id: req.user.id }, function (err, user) {
			Passport.findOne({
				protocol : 'local'
				, user     : user.id
			}, function (err, passport) {
				if (passport) {
					passport.validatePassword(oldpass, function (err, result) {
						if (!result)
						{
							res.badRequest();
						}
						else
						{
							passport.password = newpass;
							passport.save();
							res.ok();
						}
					});
				}
			});
		});
	},
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	}
};

