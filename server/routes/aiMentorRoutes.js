const express = require("express");
const router = express.Router();

router.post("/chat", (req, res) => {
  const { message } = req.body;

  return res.status(200).json({
    reply: `You asked: ${message}`,
  });
});

module.exports = router;