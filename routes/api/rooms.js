const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Room = require("../../models/Room");

const generateRoomCode = (length = 6) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let roomCode = '';
  for (let i = 0; i < length; i++){
    roomCode += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return roomCode;
};

router.post('/', passport.authenticate("jwt", { session: false }), 
  async (req, res) => {
    let io = req.app.get("io");
    
    let codeExists = true;
    let roomCode;
    while (codeExists){ 
      roomCode = generateRoomCode()
      codeExists = await Room.exists({ code: roomCode })
    }

    const newRoom = new Room({
      name: req.body.name,
      game: req.body.game,
      seatedUsers: [{
        _id: req.user._id
      }],
      redTeam: [{
        _id: req.user.id
      }],
      blueTeam: [],
      code: roomCode
    });

    const room = await newRoom.save()
    await room.populate("seatedUsers", ["handle", "eloRating", "avatar"])
    await room.populate("redTeam")
    await room.populate("blueTeam")
    io.to('lobby').emit("room_created", room)
});

router.get('/', (req, res) => {

  Room.find()
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .populate("redTeam")
    .populate("blueTeam")
    .then(rooms => {

      const objRooms = rooms.reduce((acc, curr) => (acc[curr.code] = curr, acc), {});
      return res.json(objRooms)
    })
    .catch(err => res.status(404).json({ noRoomsFound: "No Rooms Found"}));
});



router.patch('/:code/join', passport.authenticate('jwt', {session: false}), (req, res) => {
  let io = req.app.get("io");

  // Only add to room if they aren't already in it.
  // Need validations for game size in the future
  Room.findOneAndUpdate({ code: req.params.code },
    { $addToSet: { seatedUsers: { _id: req.user._id }}},
    { new: true })
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .then(room => {
      io.to(req.params.code).emit("user_sits", room)
      io.to('lobby').emit("room_updated", room)
      res.json("success");
    })
    .catch(err => res.status(422).json({ roomNotFound: "Could not join room"}))
})

router.patch('/:code/leave', passport.authenticate('jwt', {session: false}), (req, res) => {
  let io = req.app.get("io");

  Room.findOne({ code: req.params.code })
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .then(room => {
      if(!room) {
        return res.status(404).json("No room");
      }

      room.seatedUsers.pull(req.user._id)

      // Delete the room if empty. Might need to change json response
      if(room.seatedUsers.length < 1) {
        Room.findOneAndDelete({ code: req.params.code })
          .then(deleted => res.json(deleted))
      } else {
        room.save()
          .then(room => {
            io.to(req.params.code).emit("user_leaves", room);
            io.to('lobby').emit("room_updated", room);
            res.json("success");
          })
        .catch(errs => res.json(errs))
      }
    })
})

router.patch('/:code/joinTeam', passport.authenticate('jwt', {session: false}), (req, res) => {
  let io = req.app.get("io");
  console.log(req.body.team)
  Room.findOneAndUpdate({ code: req.params.code },
    { $addToSet: { [req.body.team]: { _id: req.user._id }}},
    { new: true })
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .populate("redTeam")
    .populate("blueTeam")
    .then(room => {
      if (req.body.team === 'redTeam'){
        room.blueTeam.pull(req.user._id);
      } else {
        room.redTeam.pull(req.user._id);
      }
      room.save()
        .then(room => {
          io.to(req.params.code).emit("user_sits", room)
          io.to('lobby').emit("room_updated", room)
          res.json("success");
        })
    })
    .catch(err => res.status(422).json({ roomNotFound: "Could not join room"}))
})

router.patch('/:code/leaveTeam', passport.authenticate('jwt', {session: false}), (req, res) => {
  let io = req.app.get("io");

  Room.findOne({ code: req.params.code })
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .populate("redTeam")
    .populate("blueTeam")
    .then(room => {
      if(!room) {
        return res.status(404).json("No room");
      }

      room[req.body.team].pull(req.user._id)

      room.save()
        .then(room => {
          io.to(req.params.code).emit("user_leaves", room);
          io.to('lobby').emit("room_updated", room)
          res.json("success");
        })
      .catch(errs => res.json(errs))
    })
})


router.get('/:code', (req, res) => {
  // populate will join the associated ref for their name.
  Room.findOne({ code: req.params.code })
    .populate("seatedUsers", ["handle", "eloRating", "avatar"])
    .populate("redTeam")
    .populate("blueTeam")
    .then(room => res.json(room))
    .catch(err => res.status(404).json({ roomNotFound: "No room with that code exists" })
    );
});

router.delete('/:code', passport.authenticate('jwt', {session: false}), (req, res) => {
  let io = req.app.get("io");

  Room.findOneAndDelete({ code: req.params.code })
    .then(room => io.to('lobby').emit("room_deleted", req.params.code))
    .catch(err => res.status(404).json({ roomNotFound: "No room with that code exists" }));
});

module.exports = router;