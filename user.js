const users = [];

// Join user to chat
function userJoin(id, username) {
  const user = { id, username };
  const have = [false]
  for(let i of users){
    if(i.username === username){
    console.log('editei')

      i.id = id
      have[0] = true
    }
  }
  if(have[0] === false){
    console.log('adicionei')

    users.push(user);
  }

console.log(user)
console.log(users)
  return user;
}

// Get current user
function getCurrentUser(username) {
  console.log(users)

  return users.find(user => user.username === username);
}
function getCurrentUserById(id) {
  console.log(users)

  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  getCurrentUserById,
  userLeave,
  getRoomUsers
};