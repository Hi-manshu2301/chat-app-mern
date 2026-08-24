const Message = require("../models/Message");

exports.addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.status(201).json({ msg: "Message sent" });
    return res.status(500).json({ msg: "Failed to send message" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });

    const projected = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      id: msg._id,
    }));

    return res.status(200).json(projected);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
