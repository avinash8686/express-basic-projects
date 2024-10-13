const { registerValidation, loginValidation } = require("../validation");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//function to generate access token
function generateAccessToken(userId) {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "50m",
  });
}

const Register = async (req, res) => {
  const { name, email, password } = req.body.data;

  const { error } = registerValidation(req.body.data);
  if (error) {
    return res.status(400).send({ msg: "Validation failed!!!" });
  }

  // Check if user already exists
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).send({ msg: "Email already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id, msg: "Registration Successful" });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong, Try Again" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body.data;
  // Validate the data
  const { error } = loginValidation(req.body.data);
  if (error) {
    return res.status(400).send({ msg: "Validation failed!!!", error });
  }

  // Check if email exists
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).send({ msg: "Email doesn't exist" });

  // Check if password is correct
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send({ msg: "Email or password is wrong" });
  }

  // Create & assign an access token
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({ accessToken, refreshToken, msg: "Login successful" });
};

const RefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Check if the refresh token is valid
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Create and assign a new access token
    const accessToken = generateAccessToken(decoded._id);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).send("Invalid refresh token");
  }
};

// Helper function to generate a refresh token
function generateRefreshToken(userId) {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = { Register, Login, RefreshToken };
