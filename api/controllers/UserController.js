/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	changePassword: function(req, res){
		var oldpass = req.params("oldpassword");
		var newpass = req.params("newpassword");
		User.findOne({ id: req.user.id }, function (err, user) {
			Passport.findOne({
				protocol : 'local'
				, user     : user.id
			}, function (err, passport) {
				if (passport) {
					passport.validatePassword(oldpassword, function (err, result) {
						if (!result)
						{
							res.badRequest();
						}
						else
						{
							res.ok();
						}
					});
				}
			});
		});
	}
};

