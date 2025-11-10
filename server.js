const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Twilio client
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE;

// ✅ Root
app.get("/", (req, res) => {
  res.send("Twilio backend running.");
});

// ✅ Send OTP
app.post("/send", async (req, res) => {
  try {
    const to = req.body.to;

    const result = await client.verify
      .v2.services(SERVICE_SID)
      .verifications.create({
        to: to,
        channel: "sms"
      });

    res.json({ status: result.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Check OTP
app.post("/check", async (req, res) => {
  try {
    const to = req.body.to;
    const code = req.body.code;

    const result = await client.verify
      .v2.services(SERVICE_SID)
      .verificationChecks.create({
        to: to,
        code: code
      });

    res.json({ status: result.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
