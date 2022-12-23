const router = require('express').Router();
const Category = require('./../models/category');
const TransactionController = require('./../controllers/transaction');
const auth = require('./../auth');


// GET all income and expense transaction
router.get('/list', auth.verify, (req,res) => {
	const decodedToken = auth.decode(req.headers.authorization)
	
	TransactionController.get({userId : decodedToken.id}).then( user => res.send(user))

	// console.log("routes", user)

})



// UPDATE user to ADD transaction
router.put('/add', auth.verify, (req,res) => {
	const params = {
		userId: auth.decode(req.headers.authorization).id,
		name: req.body.name,
		type: req.body.type,
		amount: req.body.amount,
		description: req.body.description,
		balance: req.body.balance
	}
	// TransactionController.update(params).then(result => res.send(result))
	TransactionController.update(params).then(result => {
		console.log("resultBB", result)
		res.send(result)
	})
})


// GET a transaction(search record)
router.get('/search', auth.verify, (req,res) => {
	const decodedToken = auth.decode(req.headers.authorization)
	
	TransactionController.search({userId : decodedToken.id}).then( user => res.send(user))

})


module.exports = router;