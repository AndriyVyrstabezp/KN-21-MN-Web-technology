const fs = require('fs').promises;
const path = require('path');

async function read(relPath) {
  const full = path.join(__dirname, '..', relPath);
  try {
    const txt = await fs.readFile(full, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function write(relPath, data) {
  const full = path.join(__dirname, '..', relPath);
  await fs.writeFile(full, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { read, write };
