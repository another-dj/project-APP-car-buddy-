const express = require("express");

const router = new express.Router();

const Car = require("./../models/car");
const User = require("./../models/user");

router.get("/list", (req, res, next) => {
  const id = req.session.user;
  console.log(id);
  Car.find({ userId: id })
    .populate("userId")
    .then(cars => {
      console.log("CARS ", cars);
      res.render("car/list", { cars });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/new", (req, res, next) => {
  res.render("car/new");
});

router.post("/new", (req, res, next) => {
  // console.log(req.file);
  const userId = req.session.user;
  const kms = req.body.kms;
  const oil = req.body.oil;
  const name = req.body.name;
  const fuelType = req.body.fuelType;
  const insuranceType = req.body.insuranceType;
  const insuranceDate = req.body.insuranceDate;

  const car = {
    userId,
    kms,
    name,
    //oil,
    fuelType,
    insuranceType,
    insuranceDate
  };

  Car.create(car).catch(error => {
    next(error);
  });

  User.findByIdAndUpdate(userId, { myCars: car })

    .then(document => {
      console.log(document);
      res.redirect(`/cars/list`);
    })
    .catch(error => {
      next(error);
    });
});

router.get("/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      res.render("car/single", { car });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
