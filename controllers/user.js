var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    });
  })
  .post(function(req, res) {
    User.create(req.body, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  })
  .put(function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .post(function(req, res) {
    // exists so that other things work
  });

 router.route('/:id/favorites')
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  })
  .post(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      console.log(req.body)
      console.log(user)
      user.favorites.push(req.body);

      user.save(function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    })
    });
  })


module.exports = router;
