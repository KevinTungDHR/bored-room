export const room_users = (room) => {
  let users = room.redTeam.concat(room.blueTeam).concat(room.seatedUsers);
  return users.reduce((obj, user) => (obj[user._id] = user, obj) ,{});
  // Interesting syntax => (obj[user._id] = user, obj) equivalent to return {
  // obj[user._id] = user
  // return obj but this is faster because the comma operator evaluates the expression before the comma and doesnt copy obj each time;
  // }
}