const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Exercise = require("../models/exercise");

router.post("/new-user", function(req, res, next) {
  const { username } = req.body;
  let user = new User({ username });
  user.save(function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

router.get("/users", function(req, res, next) {
  User.find({}, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

router.post("/add", function(req, res, next) {
  let { userId, description, duration, date } = req.body;
  date = new Date(date) != "Invalid Date" ? new Date(date) : new Date();

  User.findById(userId, function(err, user) {
    if (err) return next(err);

    let exercise = new Exercise({
      description,
      duration,
      date,
      userId,
      username: user.username
    });

    exercise.save(function(err, data) {
      if (err) return next(err);
      let out = {
        _id: userId,
        username: data.username,
        date: data.date.toDateString(),
        duration: data.duration,
        description: data.description
      };
      res.json(out);
    });
  });
});

router.get("/log", function(req, res, next) {
  let { userId, from, to, limit } = req.query;
  limit = parseInt(limit);
  from = new Date(from) != "Invalid Date" ? new Date(from) : 0;
  to = new Date(to) != "Invalid Date" ? new Date(to) : Date.now();

  User.findById(userId, function(err, user) {
    if (err) return next(err);

    Exercise.find(
      {
        userId,
        date: { $lte: to, $gte: from }
      },
      { __v: 0, _id: 0 }
    )
      .limit(limit)
      .exec(function(err, exercises) {
        if (err) return next(err);
        const out = {
          userId,
          username: user.username,
          count: exercises.length,
          log: exercises.map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
          }))
        };
        res.json(out);
      });
  });
});

module.exports = router;
