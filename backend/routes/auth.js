const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendMail } = require('../middleware/sendmail');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/sign_in', async (req, res) => {
	try{
		const { email, password } = req.body;
		const user = await User.findOne(
			{ email, password }
		);
		if(!user) return res.status(404).json({error: 'User does not exists'})
		res.status(200).json({status: `You are signed in successfully ${user?.firstName ? user.firstName : email}`, userId: user._id});
	} catch(err) {
		console.log(err.message);
    	res.status(500).json({ error: "Server error" });
	}
})

router.post('/send_otp', async (req, res) => {
	try{
		const { otp } = req.body;
		console.log(otp);
		const user = await User.findOne({ otp });
		if(!user) return res.status(400).json({error: "Otp not found!"});
		await user.updateOne(
			{ email: user.email },
			{ $set: { otp: '' } } 
		);
		res.status(200).json({ status: 'OTP Successfully verified 🥳', email: user.email, userId: user._id});
	} catch (err){
		console.log(err.message);
		res.status(500).json({ error: "Server error" });
	}
})

router.post('/email_verify', async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log(email);
		let user = await User.findOne({ email });

		if (user) return res.status(400).json({ error: 'Email already exists' });

		const otp = generateOTP();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

		user = new User({ email, password, otp, otpExpires: otpExpiry });
		await user.save();

		await sendMail(email, "Your OTP Code", `Your OTP is ${otp}`);

		res.status(200).json({ status: `OTP sent to ${email}` });
	} catch (err) {
		console.log(err.message);
		res.status(500).json({ error: "Server error" });
	}
});

router.get('/delete_account/:email', async (req, res) => {
	try{
		const { email } = req.params;
		const user = await User.findOne({ email });
		if(!user) {
			return res.status(404).json({ status: 'user not found'})
		}
		await User.deleteOne({ email });
    	res.json({ message: "Account deleted successfully" });
	} catch(err) {
		console.log(err.message);
		res.status(500).json({ error: "Server error" });
	}
})


module.exports = router;