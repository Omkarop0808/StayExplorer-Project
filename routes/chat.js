const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const getModel = require("../utils/geminiClient");

router.get("/:id", async (req, res) => {
  res.render("listings/chat.ejs", { listingId: req.params.id });
});

router.post("/api", express.json(), async (req, res) => {
  const { messages = [], listingId } = req.body;

  const model = getModel();

  const listing = await Listing.findById(listingId);
  let listingContext = "";
  if (listing) {
    listingContext = `\nListing:\n• ${listing.title}\n• ${listing.location}, ${listing.country}\n• ₹${listing.price} / night\n• ${listing.description}`;
  }

  const fullHistory = [
    {
      role: "user",
      parts: [{ text: `You are a friendly travel assistant. Help with questions related to this listing.${listingContext}` }]
    },
    ...messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }))
  ];

  const chat = model.startChat({ history: fullHistory });

  const userMessage = messages[messages.length - 1]?.content || "";
  const result = await chat.sendMessage(userMessage);
  const reply = result.response.text();

  res.json({ reply });
});
module.exports = router;
