const { Router } = require("express");
const router = new Router();

const User = require("./../models/user");
const bcryptjs = require("bcryptjs");

const uploader = require("./../middleware/upload");
const routeGuard = require("./../middleware/route-guard");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", (req, res, next) => {
  
  res.render("authentication/register");
});

router.post("/register", uploader.single("avatar"), (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.file.url;
  console.log(avatar);
  console.log(name, email, password);
  return bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        avatar
      });
    })
    .then(user => {
      console.log("user created---->", user);
      req.session.user = user._id;
      res.redirect("/");
    })
    .catch(error => {
      next(error);
    });
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
        res.redirect("/cars");
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
