const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(409).json({ msg: "Username already taken" });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAvatarSet: user.isAvatarSet,
        avatarImage: user.avatarImage,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Incorrect username or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ msg: "Incorrect username or password" });
    }

    const token = signToken(user._id);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAvatarSet: user.isAvatarSet,
        avatarImage: user.avatarImage,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.setAvatar = async (req, res) => {
  try {
    const { avatarImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isAvatarSet: true, avatarImage },
      { new: true }
    );
    return res.status(200).json({
      isSet: user.isAvatarSet,
      image: user.avatarImage,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "username avatarImage _id"
    );
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
