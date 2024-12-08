const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  const connectionString = process.env.connectionString;
  if (!connectionString) {
    console.error("Connection string is missing in the environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
