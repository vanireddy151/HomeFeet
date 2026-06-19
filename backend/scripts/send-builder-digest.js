const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('../db');

const { sendTodayBuilderDigest } = require('../lib/builderDigest');

const readArg = (name, fallback) => {
  const arg = process.argv.find((value) => value.startsWith(`${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : fallback;
};

(async () => {
  try {
    const result = await sendTodayBuilderDigest({
      city: readArg('--city', 'Hyderabad'),
      period: readArg('--period', 'manual')
    });
    console.log(JSON.stringify(result, null, 2));
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error.message || error);
    if (error.missingConfig) {
      console.error(`Missing env: ${error.missingConfig.join(', ')}`);
    }
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
})();
