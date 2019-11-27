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
      let oilDif = newKms - car.oil;
      let tyreDif = newKms - car.tyrePressure;

      if (car.fuelType === "petrol" && oilDif > 10000) {
        console.log("oilDifFF", oilDif);
        oilChange = true;
        oilDif -= 10000;
      } else if (car.fuelType === "diesel" && oilDif > 15000) {
        console.log("oilDifFF", oilDif);
        oilChange = true;
        oilDif -= 15000;
      } else {
        console.log("oilDifFF", oilDif);
        oilChange = false;
      }
      if (tyreDif > 1000) {
        tyreStatus = "check";
        tyreDif -= 1000;
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
  const newOil = req.body.oil;
  let oilChange = false;

  Car.findById(carId)
    .then(car => {
      console.log("before update", car.oilChange);
      let dif = car.kms - newOil;

      if (car.fuelType === "petrol" && dif > 10000) {
        console.log("DIFFF", dif);
        oilChange = true;
        dif -= 10000;
      } else if (car.fuelType === "diesel" && dif > 15000) {
        console.log("DIFFF", dif);
        oilChange = true;
        dif -= 15000;
      } else {
        console.log("DIFFF", dif);
        oilChange = false;
      }

      Car.findByIdAndUpdate(carId, {
        oil: newOil,
        oilDif: dif,
        oilChange: oilChange,
        kms: car.kms
      }).then(data => {
        console.log(data);
        res.redirect(`/cars/${carId}`);
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/tyrePressure/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      console.log(car);
      Car.findByIdAndUpdate(carId, {
        tyrePressure: car.kms,
        tyreStatus: "ok"
      }).then(() => {
        res.redirect(`/cars/${carId}`);
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/insurance/:carId", (req, res, next) => {
  const carId = req.params.carId;
  //let date = new Date().toISOString().slice(0, 10);
  let date = new Date();
  Car.findById(carId).then(car => {
    let year;
    let month;
    let day;
    let yearIns;
    let monthIns;
    let dayIns;
    let insuredate = car.insuranceDate;
    switch (car.insuranceType) {
      case "monthly":
        insuredate = insuredate.slice(5);
        date = date.slice(5);
        if (insuredate === date) {
          //.. retun something
        }
        break;
      case "quarterly":
        insuredate = insuredate.slice(5);
        date = date.slice(5);
        if (insuredate === date) {
          //.. retun something
        }
        break;
      case "semiannualy":
        insuredate = insuredate.slice(5);
        date = date.slice(5);
        if (insuredate === date) {
          //.. retun something
        }

        break;
      case "yearly":
        year = date.getFullYear();
        yearIns = car.insuranceDate.getFullYear();
        month = date.getMonth();
        monthIns = car.insuranceDate.getMonth();
        day = date.getDate();
        dayIns = car.insuranceDate.getDate();
        if (month -1 === monthIns && day === dayIns) {
          const wrng = car.insuranceDate.toString().slice(4, 15);
          console.log(`Your insurance expires at ${wrng}`)
        }

        break;
    }
  });
});

router.get("/carsedit/:carId", (req, res, next) =>{
  const id = req.session.user;
  Car.find({ userId: id })
    .populate("userId")
    .then(cars => {
      console.log("CARS ", cars);
      res.render("car/editlist", { cars });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/edit/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      res.render("car/edit", { car });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/edit/:carId", (req, res, next) => {
  const carId = req.params.carId;
  const kms = req.body.kms;
  const oil = req.body.oil;
  const name = req.body.name;
  const fuelType = req.body.fuelType;
  const insuranceType = req.body.insuranceType;
  const insuranceDate = req.body.insuranceDate;

  Car.findByIdAndUpdate(carId, {
    kms: kms,
    oil: oil,
    name: name,
    fuelType: fuelType,
    insuranceDate: insuranceDate,
    insuranceType: insuranceType
  }).then(car => {
    console.log("after update", car.oilChange);
    res.redirect(`/cars/${car._id}`);
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
