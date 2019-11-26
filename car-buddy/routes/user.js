"use strict";

const { Router } = require("express");
const router = new Router();
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const uploader = require("./../middleware/upload");

router.get("/edit/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).then(user => {
    res.render("user/edit", { user });
  });
});

router.post("/edit/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const { name } = req.body;
  //const avatar = req.file ? req.file.url : "";
  //return bcryptjs
  //.hash(password, 10)
  //.then(hash => {
  User.findByIdAndUpdate(userId, {
    name: name
    //passwordHash: hash,
    //
    // });
  })
    .then(data => {
      console.log(data);
      res.redirect(`/`);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).then(user => {
    res.render("user/profile", { user });
  });
});

module.exports = router;
