const router = require('express').Router();
// const Category = require('./../models/category');
const User = require('./../models/user');
const CategoryController = require('./../controllers/category');
const auth = require('./../auth');

// router.get('/', (req,res) => {
// 	res.send('hi from transaction.js !!!')
// })

// router.get('/', (req,res)=> {
// 	CategoryController.getAll() 
// 		console.log('Hi!!! from controllers to routes');	
// });

// GET ALL categories
router.get('/get', auth.verify, (req,res)=> {
	// CategoryController.getAll().then(categories => res.send(categories));
	const decodedToken = auth.decode(req.headers.authorization)
	CategoryController.get({userId : decodedToken.id}).then( user => res.send(user))

});

// EDIT USER to Add category
router.put('/add', auth.verify, (req,res)=> {
	// console.log(auth.decode(req.headers.authorization).id)
	// console.log(req.body.name)
	const params = {
		userId: auth.decode(req.headers.authorization).id,
		name: req.body.name,
		type: req.body.type
	}

	CategoryController.update(params).then(result => res.send(result))
});



module.exports = router;