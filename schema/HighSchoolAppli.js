const mongoose = require('mongoose');

// Define the schema
const applicationSchema = new mongoose.Schema({
  name: String,
  gender: String,
  parentId: String,
  birthCertificate: String,
  institution: String,
  admRegNo: String,
  studyYear: String,
  semester: String,
  mobileNumber: String,
  email: String,
  ward: String,
  location: String,
  subLocation: String,
  familyStatus: String,
  fatherIncome: String,
  motherIncome: String,
  applicationDate: String,
  images: [String],
  approved: { type: Boolean, default: false },
});

// Create the model
const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
