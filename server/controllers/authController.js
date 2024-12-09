const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/User');

// Register Logic
exports.register = async (req, res) => {
  console.log("Inside the register function");
  const { username, email, password, role } = req.body;
  console.log(username, email, password, role);
  
  try {
    // Check if email already exists in the database
    const userDetails = await users.findOne({ email });
    console.log(userDetails);
    console.log("Inside try");
    
    // If existing user is found
    if (userDetails) {
      res.status(401).json("User already exists");
    } else {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new users({
        username,
        email,
        password: hashedPassword,
        role
      });
      console.log(newUser);

      
      await newUser.save(); // Save to MongoDB
       res.status(200).json(newUser); // Send response to client side
    }
  } catch (error) {
    console.error("Registration error:", error);
     res.status(500).json({ error: "Internal server error" });
  }
};

// Login
exports.login = async (req, res) => {
  console.log("Inside the login function");

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await users.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in the environment variables.");
      res.status(500).json({ error: "Internal server error" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    console.log("Generated token:", token);  // Log the generated token for debugging

    // Send response with token and user info
    return res.status(200).json({
      message: "User logged in successfully",
      token: token,  // Include the token in the response
      user: { id: user._id, username: user.username, email: user.email },
    });
  }catch (error) {
    console.error("Login error:", error.message || error);
  
    // Handle known errors with proper status codes
    if (error.response && error.response.status) {
      return res.status(error.response.status).json({
        error: error.response.data?.message || "An error occurred during login.",
      });
    }
  
    // Default fallback for unexpected errors
    res.status(500).json({ error: "Internal server error" });
  }
  
};
