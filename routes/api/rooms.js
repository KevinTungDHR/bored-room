const express = require("express");
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
  (req, res) => {
    
    const newRoom = new Room({
      name: req.body.name,
      code: generateRoomCode()
    });

    newRoom.save().then(room => res.json(room));
});

router.get('/', (req, res) => {
  Room.find()
    .then(rooms => res.json(rooms))
    .catch(err => res.status(404).json({ noRoomsFound: "No Rooms Found"}));
});

router.get('/:code', (req, res) => {
  Room.findOne({ code: req.params.code })
    .then(room => res.json(room))
    .catch(err => res.status(404).json({ roomNotFound: "No room with that code exists" })
    );
});

module.exports = router;