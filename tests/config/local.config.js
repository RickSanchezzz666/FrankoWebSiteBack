const unitConfig = require('./jest.config');
const integrationConfig = require('./integration.config');

const rootDir = './project';

module.exports = {
 projects: [
  {
   ...unitConfig,
   rootDir,
  },
  {
   ...integrationConfig,
   rootDir,
  }
 ]
};