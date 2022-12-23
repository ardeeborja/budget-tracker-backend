const User = require('./../models/user');

module.exports.get = (params) => {
	return User.findById(params.userId).select({password: 0}).then(user => {
		console.log(user.category[0].name)
		return user
	})
}


module.exports.update = params => {	
	console	.log('paramsQQ', params)
	return User.findByIdAndUpdate(params.userId, {balance: params.balance}).then (user => {
		console	.log('userQQ', user)

		user.category.forEach(category => {
			console.log('categoryQQ',category)
			// console.log('categoryRR',category.name)
			if (category.name === params.name && category.type === params.type) {
				console.log('MATCH')
				const newTransaction = {amount: params.amount, description: params.description, balance: params.balance, transactionDate: new Date()}
				category.transaction.push(newTransaction)
			}
		})
		return user.save().then(user => {
			console.log('USERQQ', user)
			return user ? true: false
		})				

	})
}

module.exports.search = (params) => {
	return User.findById(params.userId).select({password: 0}).then(user => {
		console.log('enter')
		// console.log(user.category[0].name)
		// const descList = []
		// user.category.forEach(category => {
		// 	console.log('categoryQQ',category)
		// 	console.log('categoryRR',category.name)
		// 	category.transaction.forEach(tran => {
		// 		console.log('tran', tran.description)
		// 		if (user.description === params){
		// 			console.log('MATCH')
		// 		}
		// 	})
		return user
		
	})
}