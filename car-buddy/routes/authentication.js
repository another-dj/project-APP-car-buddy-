const { Router } = require("express");
const router = new Router();

const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");


const routeGuard = require("./../middleware/route-guard");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", (req, res, next) => {
  res.render("authentication/register");
});

router.post("/register", (req, res, next) => {
  let token = "";
  const generateId = length => {
    const characters =
      "0123456789abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ";
    for (let i = 0; i < length; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
  };
  generateId(15);
  const { name, email, password } = req.body;

  console.log("req", req);
  console.log("req body: ", req.body);
  console.log("BODY", name, email, password);
  
  return bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationCode: token
      });
    })
    .then(user => {
      console.log("user created---->", user);
      req.session.user = user._id;
      res.redirect("/");
    })
    .then(() => {
      console.log("sending mail here ----------------------");
      transporter.sendMail({
        from: `"CarBuddy Team"<${process.env.EMAIL}>`,
        to: req.body.email,
        subject: "CarBuddy confirmation email",
        html: `<div align='center'>
        <br>
        <br>
        <big>CarBuddy Confirmation Email</big>
        <br>
        <br>
        <strong>hello</strong>
        <br>
        <p>Thanks for joining our community! Please confirm your account by clicking on the link:</p>
        <strong><a href="http://localhost:3000/authentication/confirm/${token}">Link</a></strong>
        <br>
        <br>        
        <strong>Great to see you!</strong>
        <br>
        <br>
        <br>
        </div>`
      });
    })
    .catch(error => {
      console.log('register', error);
      next(error);
    });
});

router.get("/confirm/:token", (req, res, next) => {
  const token = req.params.token;
  User.findOneAndUpdate({ confirmationCode: token }, { status: "active" })
  .then(() => {
      res.redirect("/cars/list");
    }
  );
});

router.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

router.post("/login", (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect("/");
      } else {
        return Promise.reject(new Error("Wrong password."));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
