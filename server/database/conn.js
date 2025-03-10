const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection successful to DataBase");
  } catch (error) {
    console.error("Could not connect to Database !!", error);

    process.exit(0);
  }
};

module.exports = connectDb;