const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendMail } = require('../middleware/sendmail');

router.post('/details', async (req, res) => {
	try{
		const { email } = req.body;
		const user = await User.findOne({ email}).select('-password');
		if(!user) return res.status(404).json({error: 'user not found'});
		res.status(200).json(user);
	} catch(err) {
		console.log(err.message);
		res.status(500).json({error: 'server error'});
	}
})

router.post('/save_details', async (req, res) => {
	try {
		const {firstName, lastName, contact, address, profile_img, agreeToTerms, email} = req.body;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exists' });
		}

		const updatedUser = await User.findOneAndUpdate(
			{ email },
			{ firstName, lastName, contact, address, profile_img, agreeToTerms },
			{ new: true }
		);

		res.status(200).json({user: updatedUser});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: 'Server error' });
	}
});


module.exports = router;