// Import dependencies
const express = require("express");
const mongoose = require("mongoose");

// Initialize express server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes"));

// Mongoose connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/mongo-social-api",
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("debug", true);

// Launch server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));
