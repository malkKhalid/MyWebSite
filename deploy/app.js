// cPanel "Setup Node.js App" startup file (Phusion Passenger).
// Passenger requires the express app to be exported, never app.listen().
const fs = require('fs');
const path = require('path');

function resolveServerDir() {
  const local = path.join(__dirname, 'server');
  if (fs.existsSync(local)) return local;
  return path.join(__dirname, '..', 'server');
}

const serverDir = resolveServerDir();

require(require.resolve('ts-node', { paths: [serverDir] })).register({
  project: path.join(serverDir, 'tsconfig.json'),
  transpileOnly: true,
});

const mod = require(path.join(serverDir, 'index.ts'));
const app = mod.app || mod.default;

if (!app) {
  throw new Error('server/index.ts did not export the express app');
}

module.exports = app;
