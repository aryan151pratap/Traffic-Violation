const express = require('express');
const router = express.Router();
const Backend = require('../models/backend');

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

module.exports = router;