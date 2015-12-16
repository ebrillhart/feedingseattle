var express = require('express');
var User = require('../models/user');
var router = express.Router();
// route for /users
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

// route for users/:id
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

// route for users/:id/favorites
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
  });

  // root for users/:id/favorites/:idx
  router.route('/:id/favorites/:idx')
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) return res.status(500).send(err);
      res.send(user);
    });
  })
  .delete(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      user.favorites.splice(req.params.idx, 1);

      user.save(function(err) {
        if (err) return res.status(500).send(err);
        res.send({'message': 'success'});
      });
    });
  });

module.exports = router;
