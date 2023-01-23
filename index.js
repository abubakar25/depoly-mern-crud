const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const path = require("path");

// app.use(cors());
app.use(cors({ credentials: true, origin: true }));

dotenv.config({ path: "./config.env" });

require("./db/conn");

app.use(express.json());

app.use(require("./routes/auth"));

// const User = require("./model/userSchema");

const PORT = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send("Welcome to Home Page");
// });

// app.get("/contact", (req, res) => {
//   res.cookie("myCookie", "myCookie");
//   console.log(cookie);
//   res.send("Welcome to Contact Page");
// });

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.get("/login", (req, res) => {
  res.send("Welcome to Login Page");
});

app.listen(3000, () => {
  console.log(`Server Running on port ${PORT}`);
});
