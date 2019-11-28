"use strict";

const { join } = require("path");
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const serveFavicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");

const MongoStore = connectMongo(expressSession);

const User = require("./models/user");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const carRouter = require("./routes/car");
const authenticationRouter = require("./routes/authentication");

const app = express();

hbs.registerHelper("if_eq", function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerPartials(__dirname + "/views/partials");

app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(serveFavicon(join(__dirname, "public/images", "favicon.ico")));
app.use(
  sassMiddleware({
    src: join(__dirname, "public"),
    dest: join(__dirname, "public"),
    outputStyle:
      process.env.NODE_ENV === "development" ? "nested" : "compressed",
    sourceMap: true,
    force: process.env.NODE_ENV === "development"
  })
);
app.use(express.static(join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

// COOKIE
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 15,
      // sameSite: true,
      sameSite: "lax", //lax=relaxed used because 'use strict'
      httpOnly: true,
      secure: process.env.NODE_ENV == "production"
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24
    })
  })
);

// Deserializing user
// Checks if there's a user ID saved on the session
// If so, load the user from the database and bind it into req.user
app.use((req, res, next) => {
  const userId = req.session.user;
  if (userId) {
    User.findById(userId)
      .then(user => {
        req.user = user;
        // Set the user in the response locals, so it can be accessed from any view
        res.locals.user = req.user;
        // Go to the next middleware/controller
        next();
      })
      .catch(error => {
        next(error);
      });
  } else {
    // If there isn't a userId saved in the session,
    // go to the next middleware/controller
    next();
  }
});

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/cars", carRouter);
app.use("/authentication", authenticationRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  res.status(error.status || 500);
  res.render("error");
});

module.exports = app;
