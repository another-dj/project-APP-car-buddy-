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
  let oilChange = false;
  let tyreStatus = "";

  Car.findById(carId)
    .then(car => {
      console.log("before update", car.oilChange);
      const oilDif = newKms - car.oil;
      const tyreDif = newKms - car.tyrePressure;

      if (car.fuelType === "petrol" && oilDif >= 10000) {
        console.log("oilDifFF", oilDif);
        oilChange = true;
      } else if (car.fuelType === "diesel" && oilDif >= 15000) {
        console.log("oilDifFF", oilDif);
        oilChange = true;
      } else {
        console.log("oilDifFF", oilDif);
        oilChange = false;
      }
       if ( tyreDif >= 1000) {
         tyreStatus = "check";
       }

      Car.findByIdAndUpdate(car._id, {
        kms: newKms,
        oilChange: oilChange,
        oilDif: oilDif,
        tyreStatus: tyreStatus,
        tyreDif: tyreDif
      }).then(() => {
        console.log("after update", car.oilChange);
        res.redirect(`/cars/${car._id}`);
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/oil/:carId", (req, res, next) => {
  const carId = req.params.carId;
  const newKms = req.body.kms;
  let oilChange = false;

  Car.findById(carId)
    .then(car => {
      console.log("before update", car.oilChange);
      const dif = newKms - car.oil;

      if (car.fuelType === "petrol" && dif >= 10000) {
        console.log("DIFFF", dif);
        oilChange = true;
      } else if (car.fuelType === "diesel" && dif >= 15000) {
        console.log("DIFFF", dif);
        oilChange = true;
      } else {
        console.log("DIFFF", dif);
        oilChange = false;
      }

  Car.findByIdAndUpdate(carId, {
    oil: req.body.oil,
    oilDif: dif,
    oilChange: oilChange
  })
    .then(data => {
      console.log(data);
      res.redirect(`/cars/${carId}`);
    });
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
