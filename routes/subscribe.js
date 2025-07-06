// routes/subscribe.js
const express = require("express");
const router = express.Router();
const { validateSubscriber,isLoggedIn } = require("../middleware");
const Subscriber = require("../models/subscriber");
const nodemailer = require("nodemailer");

/* Setup Nodemailer - Gmail */
const MAIL_USER = "omkarpatil0808pancholia@gmail.com";
const MAIL_PASS = "rinz slnx bsmc bfie";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

/* POST /subscribe */
router.post("/subscribe", 
    isLoggedIn,
    validateSubscriber, async (req, res) => {
  const { email } = req.body.subscriber;
  console.log(email);

  try {
    await Subscriber.updateOne({ email }, {}, { upsert: true });

    await transporter.sendMail({
      from: '"StayExplorer" <no-reply@stayexplorer.com>',
      to: MAIL_USER,
      subject: "🎉 New Subscriber",
      text: `New subscriber joined: ${email}`
    });

    req.flash("success", "Thank you for subscribing StayExplorer!");
  } catch (err) {
    console.error(err);
    req.flash("error", "Subscription failed. Try again.");
  }

  res.redirect("/listings");
});

module.exports = router;
