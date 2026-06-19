const mongoose = require('mongoose');
const BuilderContact = require('../models/BuilderContact');
const hyderabadBuilderContacts = require('../data/hyderabadBuilderContacts');

require('../db');

const seedHyderabadBuilderContacts = async () => {
  const results = {
    imported: 0,
    skipped: 0,
    totalSeedContacts: hyderabadBuilderContacts.length
  };

  for (const contact of hyderabadBuilderContacts) {
    try {
      await BuilderContact.findOneAndUpdate(
        { city: contact.city, companyName: contact.companyName },
        contact,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      results.imported += 1;
    } catch (error) {
      results.skipped += 1;
      console.error(`Skipped ${contact.companyName}: ${error.message}`);
    }
  }

  console.log(`Hyderabad builder contacts loaded: ${results.imported}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Seed contacts: ${results.totalSeedContacts}`);
};

seedHyderabadBuilderContacts()
  .catch((error) => {
    console.error('Failed to seed Hyderabad builder contacts:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
