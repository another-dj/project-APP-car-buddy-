const express = require("express");

const router = new express.Router();

const Car = require("./../models/car");
const User = require("./../models/user");

/* router.get('/', (req, res, next) => {
  Car.findbyId()
  .then(cars=>{

    res.render('carList', {cars});
  });
  res.render('carList');
}); */

router.get("/new", (req, res, next) => {
  res.render("car/new");
});

router.post("/new", (req, res, next) => {
  // console.log(req.file);
  const creatorId = req.session.user;
  const kms = req.body.kms;
  const oil = req.body.oil;
  const fuelType = req.body.fuelType;
  const insuranceType = req.body.insuranceType;
  const insuranceDate = req.body.insuranceDate;

  Car.create({
    creatorId,
    kms,
    //oil,
    fuelType,
    insuranceType,
    insuranceDate
  })
    .then(document => {
      console.log(document);
      res.redirect(`/`);
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
