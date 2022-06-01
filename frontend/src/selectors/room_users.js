export const room_users = (room) => {
  return room.redTeam.concat(room.blueTeam).concat(room.seatedUsers);
}