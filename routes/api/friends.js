const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const passport = require('passport');
const mongoose = require('mongoose');

module.exports = router;

router.post('/request/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const requester = await User.findOneAndUpdate(
      { _id: req.user._id, acceptedFriends: { $ne: mongoose.Types.ObjectId(req.params.friendId) } },
      { $addToSet: { requestedFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })
  
    const requestee = await User.findOneAndUpdate(
      { _id: req.params.friendId, acceptedFriends: { $ne: req.user._id }, rejectedFriends: { $ne: req.user._id } },
      { $addToSet: { pendingFriends: req.user._id }},
      { new: true })

    // requestee or requester will return null if the $ne condition is met. Can use for websockets.
  
    res.json(requester || req.user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.delete('/request/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $pull: { requestedFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })

    const requestee = await User.findOneAndUpdate({ _id: req.params.friendId},
       { $pull: { pendingFriends:  req.user._id}},
       { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.post('/accept/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $addToSet: { acceptedFriends: req.params.friendId  },
        $pull: { pendingFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })

    const friend = await User.findOneAndUpdate({ _id: req.params.friendId },
      { $addToSet: { acceptedFriends: req.user._id },
        $pull: { requestedFriends: req.user._id }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }

})

router.post('/reject/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, acceptedFriends: { $ne: mongoose.Types.ObjectId(req.params.friendId) } },
      { $addToSet: { rejectedFriends: mongoose.Types.ObjectId(req.params.friendId) },
        $pull: { pendingFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.delete('/reject/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { rejectedFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.delete('/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id },
      { $pull: { acceptedFriends: mongoose.Types.ObjectId(req.params.friendId) }},
      { new: true })

    const oldFriend = await User.findOneAndUpdate({ _id: req.params.friendId },
      { $pull: { acceptedFriends: req.user._id }},
      { new: true })

      res.json(user)
  } catch (error) {
    res.status(422).json(error)
  }
})

router.get('/:friendId', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try{
    const user = await User.findById({ _id: req.params.friendId });
    let friends
    if(user._id.equals(req.user._id)){
      allFriends = user.acceptedFriends
        .concat(user.rejectedFriends)
        .concat(user.pendingFriends)
        .concat(user.requestedFriends)
      friends = await User.find({ _id: { $in: allFriends }});
    } else {
      friends = await User.find({ _id: { $in: user.acceptedFriends }});
    }
    res.json(friends);
  } catch (errors){
    res.status(422).json(errors);
  }
})