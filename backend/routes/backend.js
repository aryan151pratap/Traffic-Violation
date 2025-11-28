const express = require('express');
const router = express.Router();
const Backend = require('../models/backend');
const User = require('../models/user');

router.get('/backend', async (req, res) => {
	try{
		console.log("hello");
		const url = await Backend.findOne();
		console.log(url);
		res.status(200).json({url, status: 'Sucessfully url added!'});
	} catch(err) {
		console.log(err);
	}
})

router.post('/save_url', async (req, res) => {
	try{
		const { url } = req.body;
		const backend = await Backend.findOneAndUpdate(
			{},
			{ url },
			{ upsert: true, new: true }
		);

		res.status(200).json({url});
	} catch(err) {
		console.log(err);
	}
})

router.get('/user-dashboard/:email', async (req, res) => {
	try{
		const {email} = req.params;
		console.log(email);
		if(!email) return res.status(400).json({message: "email not found"});
		const user = await User.findOne({email});
		if(!user) return res.status(400).json({message: "user not found"});
		res.json(user);
	} catch (err) {
		console.log(err);
	}
})

module.exports = router;