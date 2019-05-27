const path = require('path');
const Pact = require('../../node_modules/@pact-foundation/pact/pact').Pact;

global.port = 1234;
global.provider = new Pact({
  port: global.port,
  log: path.resolve(process.cwd(), 'coverage', 'logs', 'mockserver-integration.log'),
  dir: path.resolve(process.cwd(), 'coverage', 'pacts'),
  spec: 2,
  cors: true,
  logLevel: "debug",
  pactfileWriteMode: 'update',
  consumer: 'plandialog-frontend',
  provider: 'MyProvider',
});

