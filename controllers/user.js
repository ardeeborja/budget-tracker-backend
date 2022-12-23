const User = require('../models/user');
const bcrypt = require('bcrypt');
const {createAccessToken} = require('./../auth');
const nodemailer = require('nodemailer')

//this package allows the use of goggle login client and verify the token id
const {OAuth2Client} = require('google-auth-library')
//save the clientid for google login
const clientId="793860826559-5ai2gtrphvumfqd0t8tdr6csctmtmusp.apps.googleusercontent.com"


module.exports.emailExists = (params) => {
	return User.find({email: params.email}).then(result => {
		return result.length > 0 ? true : false
	})
}

module.exports.register = (params) => {
	let newUser = new User({
		firstName: params.firstName,
		lastName: params.lastName,
		email: params.email,
		mobileNo: params.mobileNo,
		// 10 = salt/string of characters added to the password before hashing
		//"juan1234abcdefghij" = "rejdfposjdfpsdf"
		password: bcrypt.hashSync(params.password, 10),
		loginType: "email"
	})

	return newUser.save().then((user,err) => {
		return (err) ? false : true
	})
}


// module.exports.login = (params) => {
module.exports.login = (req,res) => {

	User.findOne({email: req.body.email})
	.then (user => {
		if (!user) {
			res.send(false)
		} else {
			// res.send(user)
			console.log(req.body.password)
			console.log(user.password)
			
			let comparePasswordResult = bcrypt.compareSync(req.body.password, user.password);
			if (!comparePasswordResult) {
				res.send(false)
			} else {

				res.send({accessToken: createAccessToken(user)})
			}
		}
	}).catch (err => {
		res.status(500).send("Server Error")
	})


}


module.exports.get = (params) => {
	// return User.findById(params.userId).then(user => {
	// 	user.password = undefined
	return User.findById(params.userId).select({password: 0}).then(user => {

		return user

	})
}



module.exports.update = params => {
	// console.log('im from controller editProfile')
	// console.log('params', params)
	let { id, firstName, lastName, email, mobileNo } = params
	return User.findByIdAndUpdate(id, { firstName, lastName, email, mobileNo }).then( (doc, err) => {
		return err ? false : true
	} )
}


//google login
module.exports.verifyGoogleTokenId = async (tokenId,googleAccessToken) => {


	// console.log(tokenId)
	console.log('googleAccessToken', googleAccessToken)	

	//create a new OAuth2Client with our clientId for identification and authorization to use OAuth2
	const client = new OAuth2Client(clientId)
	const data = await client.verifyIdToken({idToken: tokenId, audience: clientId})
	console.log(data)

	//run this if the email from the data payload is verified
	if (data.payload.email_verified === true) {
		//check if user's email is registered already, .exec() in mongoose, works like your .then() and that it allows the execution of the following statements
		const user = await User.findOne({email: data.payload.email}).exec()

		//if user variable logs null = not yet registered in DB
		console.log(user)

		if (user !== null) {
			console.log("A user with the same email has beed registered")

			console.log(user)
			if (user.loginType === "google") {

				return {accessToken: createAccessToken(user)}

			} else {

				return {error: 'login-type-error'}
			}


		} else {
			//register the user to DB
			console.log("payload", data.payload)
			const newUser = new User({
				firstName: data.payload.given_name,
				lastName: data.payload.family_name,
				email: data.payload.email,
				loginType: "google"
			})

			//save our new user into the DB
			return newUser.save().then((user,err)=>{

				// email sending feature
				const mailOptions = {
					from: 'ardee.borja@gmail.com',
					to: user.email,
					subject: 'Thank you for registering to Next booking System',
					text: `You registered to Next Booking System on ${new Date().toLocaleString()}`,
					html: `You registered to Next Booking System on ${new Date().toLocaleString()}`
				}


				const transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						type: 'OAuth2',
						user: process.env.MAILING_SERVICE_EMAIL,
						clientId: process.env.MAILING_SERVICE_CLIENT_ID,
						clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
						refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
						accessToken: googleAccessToken
					}
				})

				//create a function to send our mail
				//use transporter as the params to send our mail with the proper authorizations:
				function sendMail(transporter){
					transporter.sendMail(mailOptions, function (err,result){

						if (err){
							console.log(err)
							transporter.close()
						} else if (result) {
							console.log(result)
							transporter.close()
						}
					})
				}

				sendMail(transporter)

				//create our new user an access token to immediately login
				return {accessToken: createAccessToken(user)}
			})

		}


	} else {

		//if the google tokenid given has an error 
		return {error: "google-auth-error"}

	}

}