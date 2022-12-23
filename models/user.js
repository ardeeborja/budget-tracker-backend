const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   firstName: {
       type: String,
       required: [true, 'First name is required.']
   },
   lastName: {
       type: String,
       required: [true, 'Last name is required.']
   },
   email: {
       type: String,
       required: [true, 'Email is required.']
   },
   password: {
       type: String
   },
   mobileNo: {
       type: String
   },
   balance : {
      type: Number,
      default : 0
   },
   loginType: {
      type: String,
      required: [true, 'Login Type is Required']
   },   
  category: [
    {
      name: {
          type: String
      },
      type : {
          type: String
      },  
      transaction: [
        {
          amount: {
            type: Number
          },
          description : {
            type: String
          },
          balance : {
            type: Number,
            default : 0
          },          
          transactionDate : {
            type: Date
          }          
        }
      ]

    }
  ]

})

module.exports = mongoose.model('User', userSchema);