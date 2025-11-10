const express = require("express");
const cors = require("cors");
const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

const SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE;

app.post("/send", async (req, res) => {
  try {
    const result = await client.verify.v2
      .services(SERVICE_SID)
      .verifications.create({ to: req.body.to, channel: "sms" });

    res.json({ status: result.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/check", async (req, res) => {
  try {
    const result = await client.verify.v2
      .services(SERVICE_SID)
      .verificationChecks.create({
        to: req.body.to,
        code: req.body.code,
      });

    res.json({ status: result.status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (_, res) => res.send("Twilio backend running."));

app.listen(process.env.PORT || 3000);