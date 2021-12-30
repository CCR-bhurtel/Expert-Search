const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

const express = require("express");
const path = require("path");

dotenv.config({ path: "./config.env" });

if (process.env.NODE_ENV == "production") {
  // Set static folder
  app.use(express.static(__dirname + "/client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception: shutting down the app");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: Shutting down the app");
  server.close(() => {
    process.exit(1);
  });
});

const db = process.env.DATABASE;

const connectDB = async () => {
  try {
    mongoose
      .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () =>
          console.log(`LISTENING TO REQUESTS IN PORT ${PORT}`)
        );
      });
    console.log("Connected to the database");
  } catch (err) {
    console.error(err.message);

    // Exit process with faliure
    process.exit(1);
  }
};

connectDB();
