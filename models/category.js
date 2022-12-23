const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
	name: {
			type: String,
			required : [true, "Category name is required"]
	},
	type : {
			type: String,
			required : [true, "Category type is required"]
	},
	transactions: [
		{
			userId: {
				type: String,
				required : [true, "User Id is required"]
				},			
			amount: {
				type: Number,
				required : [true, "Amount is required"]
				},
			description : {
				type: String,
				required : [true, "Amount is required"]
			},
			transactionDate : {
				type: Date,
				default: new Date()
			},
			balance: {
				type: Number,
				required : [true, "Amount is required"]
			}						
		}
	]
})



module.exports = mongoose.model('Category', categorySchema);
