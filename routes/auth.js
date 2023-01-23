const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate.js");
require("../db/conn");

// router.get("/", (req, res) => {
//   res.send("Welcome to Home Page Router js");
// });

// using promises register route

// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "Please Fill All fields" });
//   }

//   User.findOne({ email: email })
//     .then((UserExist) => {
//       if (UserExist) {
//         return res.status(422).json({ error: "User Already Exists" });
//       }
//       const user = new User({
//         name,
//         email,
//         phone,
//         work,
//         password,
//         cpassword,
//       })
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "User Register Successfully" });
//         })
//         .catch((err) => {
//           res.status(500).json({ error: "User Registered Failed" });
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// using async await register route

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please Fill All fields" });
  }

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ error: "User Already Exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Passwords don't match" });
    } else {
      const newUser = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });
      await newUser.save();

      res.status(201).json({ message: "User Register Successfully" });
    }
  } catch (error) {
    console.log(err);
  }
});

// login Route

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please Fill all fields" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      // console.log("token is ", token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Enter Valid Email Or Passowrd" });
      } else {
        res.json({ message: "user Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credientials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// about us page

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

// getdata from home and contact us page

router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      console.log(userContact);

      res.status(201).json({ message: "Saved Message Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
