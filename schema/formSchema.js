const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  name: String,
  gender: String,
  id: String,
  institution: String,
  admRegNo: String,
  studyYear: String,
  semester: String,
  courseDuration: String,
  mobileNumber: String,
  email: String,
  ward: String,
  location: String,
  subLocation: String,
  studyLevel: String,
  studyMode: String,
  familyStatus: String,
  fatherIncome: String,
  motherIncome: String,
  applicationDate: String,
  approved: { type: Boolean, default: false },
});

const FormData = mongoose.model("FormData", formDataSchema);

module.exports = FormData;
