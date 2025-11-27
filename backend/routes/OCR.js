const express = require('express');
const router = express.Router();
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

async function saveTempImage(base64) {
  const buffer = Buffer.from(base64, "base64");

  const TEMP_DIR = path.join(__dirname, "tmp");
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

  const temp = path.join(TEMP_DIR, `plate_${Date.now()}.jpg`);
  fs.writeFileSync(temp, buffer);
  return temp;
}

function extract(text) {
  const cleaned = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();

  const patterns = [
    /[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{3,4}/,
    /[A-Z]{2}\d{2}[A-Z]{2}\d{4}/,
    /[A-Z]{2}\d{2}[A-Z]\d{3}/
  ];

  for (const p of patterns) {
    const m = cleaned.match(p);
    if (m) return m[0];
  }
  return null;
}

router.post('/OCR', async (req, res) => {
	try {
		const items = req.body.data;
		if (!Array.isArray(items) || items.length === 0)
		return res.status(400).json({ error: "Invalid payload" });

		const results = [];

		for (const data of items) {
			if (!data.no_plate) continue;
			const datetime = new Date().toLocaleString("en-IN", { hour12: true });

			const tempPath = await saveTempImage(data.no_plate);

			const ocr = await Tesseract.recognize(tempPath, "eng", {
				tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
				psm: 7,
				oem: 1
			});

			const plate = extract(ocr.data.text);
			if (!plate) {
				results.push({ success: false, error: "Plate not detected", datetime });
				continue;
			}

			const user = await User.findOne({ "vehicles.vehicleNumber": plate });
			if (!user) {
				results.push({ success: false, error: "Owner not found", plate, violation: data.challan_type, datetime });
				continue;
			}

			const today = new Date().toLocaleDateString("en-IN");
			const violation = data.challan_type.toLowerCase();

			const vehicle = user.vehicles.find(v => v.vehicleNumber === plate);
			if (!vehicle) {
				results.push({ success: false, error: "Vehicle not found", plate, datetime });
				continue;
			}

			const duplicate = vehicle.challans.some(
				c => c.violation === violation && c.date === today
			);
			console.log(duplicate);
			if (duplicate) {
				results.push({ success: false, duplicate: true, plate, violation, datetime });
				continue;
			}

			const fineTable = {
				"without_helmet": 500,
				"mobile_usage": 600,
				"overloaded_bike": 700,
				"without helmet": 500,
				"mobile usage": 600,
				"overloaded bike": 700
			};

			const fineAmount = fineTable[violation] || 1000;

			const challan = {
				challanId: "CHL-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
				date: today,
				violation,
				location: "Mathura",
				fineAmount,
				status: "Pending",
				evidenceUrl: data.evidence_image
			};

			vehicle.challans.push(challan);
			await user.save();

			results.push({
				success: true,
				plate,
				user: user.name,
				challan,
				datetime
			});
		}

		res.json({results});

	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});


module.exports = router;