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
  const tyreLife = req.body.kms;
  const coolant = req.body.kms;
  const brake = req.body.kms;
  const airFilter = req.body.kms;

  const car = {
    userId,
    kms,
    name,
    oil,
    fuelType,
    insuranceType,
    insuranceDate,
    tyrePressure,
    tyreLife,
    coolant,
    brake,
    airFilter
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
  const newKms = req.body.kms;
  const carId = req.params.carId;
  let tyreStatus = "";
  let oilChange = false;
  let brakeChange = false;
  let coolantChange = false;
  let airFilterChange = false;
  let date = new Date();

  Car.findById(carId)
    .then(car => {
      console.log("before update", car.oilChange);
      let oilDif = newKms - car.oil;
      let tyreDif = newKms - car.tyrePressure;
      let coolantDif = newKms - car.coolant;
      let brakeDif = newKms - car.brake;
      let airFilterDif = newKms - car.airFilter;
      let tyreLifeDif = newKms - car.tyreLife;
      

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
      if (tyreLifeDif> 35000) {
        tyreStatus = "change";
        tyreLifeDif -= 35000;
      }
      if (coolantDif > 45000) {
        coolantChange = true;
        coolantDif -= 45000;
      }
      if (brakeDif > 75000) {
        brakeChange = true;
        brakeDif -= 75000;
      }
      if (airFilterDif > 35000) {
        airFilterChange = true;
        airFilterDif -= 35000;
      }

      /* let year;
      let month;
      let day;
      let yearIns;
      let monthIns;
      let dayIns;
      let insuredate = car.insuranceDate;
      let newDate;
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
          if (month < monthIns && day === dayIns) {
            const wrng = car.insuranceDate.toString().slice(4, 15);
            console.log(`Your insurance expires at ${wrng}`);
      
            if (car.insurancePaid) {
              newDate = new Date(`${monthIns}/${dayIns}/${yearIns + 1 } 00:00`);
            }
          }
          break;
      } */

      Car.findByIdAndUpdate(car._id, {
        kms: newKms,
        oilChange: oilChange,
        oilDif: oilDif,
        coolantChange: coolantChange,
        coolantDif: coolantDif,
        brakeChange: brakeChange,
        brakeDif: brakeDif,
        airFilterChange: airFilterChange,
        airFilterDif: airFilterDif,
        tyreStatus: tyreStatus,
        tyreDif: tyreDif,
        tyreLifeDif: tyreLifeDif

        //insuranceDate: newDate
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
      let update;
      if (car.tyreStatus === 'change') {
        update = { tyreLife:car.kms, tyrePressure: car.kms, tyreStatus: "ok" };
      } else if (car.tyreStatus === 'check' ) {
        update = { tyrePressure: car.kms, tyreStatus: "ok" };
      }
      
      Car.findByIdAndUpdate(carId, update)
      .then(() => {
        res.redirect(`/cars/${carId}`);
      });
    })
    .catch(error => {
      next(error);
    });
});

router.post("/coolant/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      console.log(car);
      Car.findByIdAndUpdate(carId, {
        coolant: car.kms,
        coolantChange: false
      }).then(() => {
        res.redirect(`/cars/${carId}`);
      });
    })
    .catch(error => {
      next(error);
    });
});
router.post("/brake/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      console.log(car);
      Car.findByIdAndUpdate(carId, {
        brake: car.kms,
        brakeChange: false
      }).then(() => {
        res.redirect(`/cars/${carId}`);
      });
    })
    .catch(error => {
      next(error);
    });
});
router.post("/airFilter/:carId", (req, res, next) => {
  const carId = req.params.carId;
  Car.findById(carId)
    .then(car => {
      console.log(car);
      Car.findByIdAndUpdate(carId, {
        airFilter: car.kms,
        airFilterChange: false
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
