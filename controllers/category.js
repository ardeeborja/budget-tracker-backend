const User = require('./../models/user');
// const Category = require('./../models/category');

// module.exports.getAll = function(req,res) {
// 	console.log('Hi!!! from routes to controllers');
// }


module.exports.get = (params) => {
	// return User.findById(params.userId).then(user => {
	// 	user.password = undefined
	return User.findById(params.userId).select({password: 0}).then(user => {

		return user
	})
}


module.exports.update = function(params) {
	// console.log('paramsQQ',params)
	return User.findById(params.userId).then (user => {
		// console.log('userQQ',user)

		user.category.push({name : params.name, type: params.type})
		return user.save().then(user => {
			return user ? true: false
		})
	})
	

}

