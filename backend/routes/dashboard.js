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
    const { name, contact, address, licenseNumber, profile_img, agreeToTerms, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
		return res.status(400).json({ error: 'User does not exist' });
    }
	console.log(name);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
		  name,
		  contact,
		  address,
		  licenseNumber,
		  profile_img,
		  agreeToTerms,
		},
		{ new: true }
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/add-vehicle", async (req, res) => {
  try {
    const { userId, vehicleNumber, vehicleType } = req.body;

    if (!userId || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vehicles.push({ vehicleNumber, vehicleType });
    await user.save();

    res.json({ message: "Vehicle added successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/delete-vehicle', async (req, res) => {
  try{
    const {email} = req.body();
  } catch (err){
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})


module.exports = router;