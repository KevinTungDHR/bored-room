const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUpdatePassword = require('../../validation/update/update_password');
const validateUpdateProfile = require('../../validation/update/update_profile');
const { db } = require("../../models/User");
const { json } = require("express/lib/response");
const mongoose = require('mongoose');


router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

module.exports = router;

router.post('/register', async (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);
  
  if(!isValid){
    return res.status(400).json(errors);
  }

  const userWithEmail = await User.findOne({ email: req.body.email })
  if (userWithEmail){
    errors.email = 'Email already registered'
    return res.status(400).json(errors);
  } 

  const userWithHandle = await User.findOne({ handle: req.body.handle })
  if (userWithHandle){
    errors.handle = 'Handle already registered'
    return res.status(400).json(errors);
  } 
  
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
            _id: user._id, 
            handle: user.handle, 
            email: user.email,
            avatar: user.avatar,
            eloRating: user.eloRating,
            bio: user.bio,
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
        .catch(err => res.status(500).json(err));
    })
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
    .select("+password") // Schema password is set to select: false so other queries don't retrieve password
    .then(user => {
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              _id: user._id, 
              handle: user.handle, 
              email: user.email,
              avatar: user.avatar,
              eloRating: user.eloRating,
              bio: user.bio,
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
            errors.password = 'Invalid Username/Password Combination'
            return res.status(400).json(errors);
          }
        })
    })
})

router.get('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
    User.findById(req.user._id)
      .then(user => {
        res.json(user)
      })
      .catch(error => {
        res.status(422).json(error)
      })
})

router.get('/profile/:_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  User.findById(req.params._id).select('-rejectedFriends -pendingFriends -requestedFriends')
    .then(user => {
      res.json(user)
    })
    .catch(error => {
      res.status(422).json(error)
    })
})

router.patch('/profile', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const { errors, isValid } = validateUpdateProfile(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findById(req.user._id)

    const userWithEmail = await User.findOne({ email: req.body.email })
    
    if (user.email === 'DemoUser@demouser.com' && user.email !== req.body.email){
      errors.email = 'Cannot change Demo User email'
      return res.status(400).json(errors);
    }

    if (userWithEmail && !userWithEmail._id.equals(user._id)){
      errors.email = 'Email already registered'
      return res.status(400).json(errors);
    } 
  
    const userWithHandle = await User.findOne({ handle: req.body.handle })
    if (userWithHandle && !userWithHandle._id.equals(user._id)){
      errors.handle = 'Handle already registered'
      return res.status(400).json(errors);
    } 

    user.set(req.body)
    let savedUser = await user.save()
    res.json(savedUser)
  } catch (errors) {
    res.status(400).json(errors)
  }
})

router.post('/friends/request', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const requester = await User.findOneAndUpdate(
      { _id: req.user._id, acceptedFriends: { $ne: mongoose.Types.ObjectId(req.body.friendId) } },
      { $addToSet: { requestedFriends: mongoose.Types.ObjectId(req.body.friendId) }},
      { new: true })
  
    const requestee = await User.findOneAndUpdate(
      { _id: req.body.friendId, acceptedFriends: { $ne: mongoose.Types.ObjectId(req.body.friendId) }, rejectedFriends: { $ne: mongoose.Types.ObjectId(req.body.friendId) } },
      { $addToSet: { pendingFriends: req.user._id }},
      { new: true })
  
    res.json(requester || req.user)
  } catch (error) {
    res.status(422).json(error)
  }
})


router.delete('/friends/request', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $pull: { pendingFriends: mongoose.Types.ObjectId(req.body.friendId) }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.post('/friends/accept', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $addToSet: { acceptedFriends: req.body.friendId  },
        $pull: { pendingFriends: mongoose.Types.ObjectId(req.body.friendId) }},
      { new: true })

    const friend = await User.findOneAndUpdate({ _id: req.body.friendId },
      { $addToSet: { acceptedFriends: req.user._id },
        $pull: { requestedFriends: req.user._id }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }

})

router.post('/friends/reject', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, acceptedFriends: { $ne: mongoose.Types.ObjectId(req.body.friendId) } },
      { $addToSet: { rejectedFriends: mongoose.Types.ObjectId(req.body.friendId) },
        $pull: { pendingFriends: mongoose.Types.ObjectId(req.body.friendId) }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.delete('/friends', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $pull: { acceptedFriends: mongoose.Types.ObjectId(req.body.friendId) }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.get('/friends', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try{
    const user = await User.findById({ _id: req.body._id });
    const friends = await User.find({ _id: { $in: user.acceptedFriends }});
    res.json(friends);
  } catch (errors){
    res.status(422).json(errors);
  }
})

router.patch('/update-password', passport.authenticate('jwt', {session: false}), (req, res) => {
  const { errors, isValid } = validateUpdatePassword(req.body);
  
  if (!isValid){
    return res.status(400).json(errors);
  }

  if (req.body.password === req.body.password2){
    User.findById(req.user._id)
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
    .catch(errors => res.status(400).json(errors))
  }
})