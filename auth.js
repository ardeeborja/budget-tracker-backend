const jwt = require('jsonwebtoken')
const secret = "SecretCourseBookingApi"

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email
	}
	// console.log(
	// jwt.sign(data, "SecretCourseBookingAPI"))
	return jwt.sign(data, secret)	
}

module.exports.verify = (req, res, next) => {
	if (req.headers.authorization){

		// userController.get({userId: user.id})
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		// console.log(token)

		let result = jwt.verify(token, secret,(err, data)=>{
			// console.log("err", err)
			// console.log("data", data)
			return data
		})
		// let decoded = jwt.verify(token,  "SecretCourseBookingApi");
		// console.log(decoded)
		if (result) {
			// res.send(result)
			req.user = result
			next()
		} else {
			res.send({auth: "failed"})
		}
	} else {
		res.send({ auth: "failed"})
	}
}


module.exports.decode = (token) => {
	if (token)  {
		token = token.slice(7, token.length)
		return jwt.verify(token, secret, (err, data) => {
			return err ? null : jwt.decode(token, {complete: true}).payload
		})
	} else {
		return null
	}
}