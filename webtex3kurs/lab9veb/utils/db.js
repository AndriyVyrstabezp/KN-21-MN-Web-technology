const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'users.json');

function readUsers() {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeUsers(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = { readUsers, writeUsers };
