const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUpdateHandle = require('../../validation/update/update_handle');
const validateUpdateEmail = require('../../validation/update/update_email');
const validateUpdatePassword = require('../../validation/update/update_password');
const validateUpdateAvatar = require('../../validation/update/update_avatar');
const validateUpdateProfile = require('../../validation/update/update_profile');
const { db } = require("../../models/User");
const { json } = require("express/lib/response");

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

module.exports = router;

router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user){
        errors.email = 'Email already exists';
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                const payload = { 
                  id: user.id, 
                  handle: user.handle, 
                  email: user.email,
                  avatar: user.avatar,
                  eloRating: user.eloRating,
                  bio: user.bio,
                  friends: user.friends
                }

                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {expiresIn: 72000},
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  });
              })
              .catch(err => console.log(err));
          })
        })
      }
    })
})

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }
  
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({email})
    .then(user => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user.id, 
              handle: user.handle, 
              email: user.email,
              avatar: user.avatar,
              eloRating: user.eloRating,
              bio: user.bio,
              friends: user.friends
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              {expiresIn: 72000},
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            errors.password = 'Incorrect password'
            return res.status(400).json(errors);
          }
        })
    })
})

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    handle: req.user.handle,
    email: req.user.email,
    avatar: req.user.avatar,
    eloRating: req.user.eloRating,
    bio: req.user.bio,
    friends: req.user.friends
  });
  
})

router.post('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  const friendHandle = {handle: req.body.friendHandle}

  User.findOneAndUpdate(friendHandle)
    .then(friend => {
      const friendInfo = new Object();
        friendInfo.handle = friend.handle 
        friendInfo.eloRating = friend.eloRating
        friendInfo.bio = friend.bio
      req.user.friends[friend.id] = friendInfo
      req.user.save()
      res.json(req.user)
    })
})

router.delete('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  const friendHandle = {handle: req.body.friendHandle}
  User.findOneAndUpdate(friendHandle)
    .then(friend => {
      req.user.friends.deleteOne(friend.id)
      req.user.save()
      res.json(req.user)
    })
})

router.get('/friend', passport.authenticate('jwt', {session: false}), (req, res) => {
  const friendHandle = {handle: req.body.friendHandle}

  User.findOne(friendHandle)
    .then(friend => {
      res.json({
        handle: friend.handle,
        avatar: friend.avatar,
        eloRating: friend.eloRating,
        bio: friend.bio
      })
    })
})

router.patch('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateUpdateProfile(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  User.findById(req.user.id)
    .then(user => {
      user.set(req.body)
      user.save()
      res.json(user)})
    .catch(errors => res.status(400).json({errors}))
})

router.patch('/update-handle', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateUpdateHandle(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  User.findById(req.user.id)
    .then(user => {
      user.set(req.body)
      res.json(user)})
    .catch(errors => res.status(400).json({errors}))
})

router.patch('/update-email', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateUpdateEmail(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  User.findById(req.user.id)
    .then(user => {
      user.set(req.body)
      res.json(user)})
    .catch(errors => res.status(400).json({errors}))
})

router.patch('/update-password', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateUpdatePassword(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  if (req.body.password === req.body.password2){
    User.findById(req.user.id)
      .then((user) => {
        user.password = req.body.password;
        const updatedUser = {user};
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            updatedUser.password = hash
            user.set(updatedUser);
            user.save()
            res.json(
              user
            );
            }
          )
        })
      })
    .catch(errors => res.status(400).json({errors}))
  }
})

router.patch('/update-avatar', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req)
  const { errors, isValid } = validateUpdateAvatar(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }
  
  User.findById(req.user.id)
    .then(user => {
      user.set(req.body)
      res.json(user)})
})

router.patch('/update-bio', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  User.findById(req.id)
    .then(user => {
      user.set(req.body)
      res.json(user)})
    .catch(errors => res.status(400).json({errors}))
})

router.patch('/update-elo-rating', passport.authenticate('jwt', {session: false}), (req, res) => {
  
  User.findById(req.user.id)
    .then(user => {
      user.set(req.body)
      res.json(user)})
    .catch(errors => res.status(400).json({errors}))
})