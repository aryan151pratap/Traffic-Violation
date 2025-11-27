import nodemailer from "nodemailer";
import emailConfig from "./emailConfig.js";

const transporter = nodemailer.createTransport(emailConfig);

// ---------- TEMPLATE ----------
export function createChallanEmailTemplate(user, vehicle, challan, pendingTotal) {
  return `
  <html>
  <body style="font-family:Arial;background:#f4f6f8;margin:0">

    <div style="max-width:700px;margin:20px auto;background:white;border-radius:8px">
      <div style="background:#c62828;padding:20px;color:white;text-align:center;font-size:20px;font-weight:bold">
        🚨 TRAFFIC CHALLAN NOTICE 🚨
      </div>

      <div style="padding:25px">
        <h3>Hello ${user.name},</h3>

        <p>Your vehicle <b>${vehicle.vehicleNumber}</b> has received a new traffic challan.</p>

        <h3>🆕 Challan Details</h3>
        <p><b>Violation:</b> ${challan.violation.toUpperCase()}</p>
        <p><b>Date:</b> ${challan.date}</p>
        <p><b>Location:</b> ${challan.location}</p>
        <p><b>Fine:</b> ₹${challan.fineAmount}</p>

        <p><b>Evidence:</b>
          <a href="${challan.evidence.screenshot}" target="_blank">View Evidence Image</a>
        </p>

        <hr/>

        <h3>📌 Pending Fine Summary</h3>
        <p><b>Total Pending:</b> ₹${pendingTotal}</p>
        <p style="color:#c62828;">Please clear this fine as soon as possible to avoid further penalties.</p>

        <p>Pay online at:
          <a href="https://trafficchallan.gov.in" target="_blank">trafficchallan.gov.in</a>
        </p>
      </div>

      <div style="padding:20px;text-align:center;font-size:13px;color:gray;">
        Traffic Police Department · Automated Email
      </div>
    </div>

  </body>
  </html>`;
}

// ---------- SEND EMAIL ----------
export async function sendChallanEmail(user, vehicle, challan, pendingTotal) {
  const html = createChallanEmailTemplate(user, vehicle, challan, pendingTotal);

  await transporter.sendMail({
    from: `Traffic Department <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `New Challan – ₹${challan.fineAmount}`,
    html
  });
}