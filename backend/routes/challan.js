const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/user', async (req, res) => {
	try{
		const user = await User.find().select("-vehicles -password");
		if(!user) return res.status(500).json({message: "users not found"});
		res.status(200).json({user});
	} catch(err) {
		console.log(err);
	}
})

router.get('/challan/:id', async (req, res) => {
	try{
		const {id} = req.params;
		const user = await User.findById(id).select("vehicles");
		if(!user) return res.status(500).json({message: "users not found"});
		res.status(200).json({user});
	} catch(err) {
		console.log(err);
	}
})

router.get('/delete-challan/:userId/:challanId', async (req, res) => {
	try{
		const {userId, challanId} = req.params;
		const user = await User.findById(userId);
		if(!user) return res.status(400).json({message: "users not found"});
		let deleted = false;
		user.vehicles.forEach(vehicle => {
			const before = vehicle.challans.length;
			vehicle.challans = vehicle.challans.filter(c => String(c._id) !== challanId);
			if (vehicle.challans.length !== before) deleted = true;
		});
		if (!deleted) {
			return res.status(404).json({ message: "Challan not found" });
		}

		await user.save();
		res.json({ success: true, message: "Challan deleted" });
	} catch(err) {
		console.log(err);
	}
})

module.exports = router;