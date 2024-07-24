const RoleAccess = {
  ADMIN: ["get_game", "get_games", "update_record", "delete_record"],
  PLAYER: ["get_game", "get_games"],
};

module.exports = { RoleAccess };
