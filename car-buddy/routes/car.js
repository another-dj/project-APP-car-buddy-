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
  const tyrePressure = req.body.kms;

  const car = {
    userId,
    kms,
    name,
    oil,
    fuelType,
    insuranceType,
    insuranceDate,
    tyrePressure
  };

  Car.create(car)
    .then(document => {
      console.log(document);
      console.log("INSURANCE DATE", insuranceDate);
      res.redirect(`/cars/list`);
    })
    .catch(error => {
      next(error);
    });
});

// car model update
router.post("/kms/:carId", (req, res, next) => {
  const carId = req.params.carId;
  const newKms = req.body.kms;
  
  Car.findById(carId)
  .then(car => {
    console.log("before update", car.oilChange );
    if (car.fuelType === 'petrol' && newKms - car.oil >= 10000) {
      console.log("OIL CHANGE");
      car.oilChange = true;
    } else if (car.fuelType === 'diesel' && newKms - car.oil >= 15000) {
      console.log("OIL CHANGE");
      car.oilChange = true;
    }
    Car.findByIdAndUpdate(car._id, { kms: newKms })
    .then(() => {
      console.log("after update", car.oilChange );
        res.redirect(`/cars/${car._id}`);
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/oil/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findByIdAndUpdate(carId, {
    oil: req.body.oil
  })
    .then(data => {
      console.log(data);
      res.redirect(`/cars/${carId}`);
    })
    .catch(error => {
      next(error);
    });
});

router.post("/delete/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findByIdAndDelete(carId)
    .then(() => {
      res.redirect("/cars/list");
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
