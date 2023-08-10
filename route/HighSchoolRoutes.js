const express = require("express");
const multer = require("multer");
const Application = require("../schema/HighSchoolAppli");
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose');

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

cloudinary.config({
  cloud_name: "charleswambua",
  api_key: "698412892359667",
  api_secret: "rIAE9A4gsBJ8T3N3Y8nlh6o7sAQ",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ngcdfmks", 
    format: async (req, file) => "png", 
    public_id: (req, file) => Date.now().toString(), 
  },
});

const upload = multer({ storage });

router.post('/submit',upload.array('images', 4), async (req, res) => {
  req.setTimeout(0);
  try {
    const newApplication = new Application({
      name: req.body.name,
      gender: req.body.gender,
      parentId: req.body.parentId,
      birthCertificate: req.body.birthCertificate,
      institution: req.body.institution,
      admRegNo: req.body.admRegNo,
      studyYear: req.body.studyYear,
      semester: req.body.semester,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      ward: req.body.ward,
      location: req.body.location,
      subLocation: req.body.subLocation,
      familyStatus: req.body.familyStatus,
      fatherIncome: req.body.fatherIncome,
      motherIncome: req.body.motherIncome,
      applicationDate: req.body.applicationDate,
      images: req.files.map(file => file.path),
      approved: false,
    });
    const savedApplication = await newApplication.save();
    res.status(201).json({ id: savedApplication._id });

    // Process the newApplication object as needed (e.g., save to the database)


  } catch (error) {
    // Handle errors and send an error response back to the client
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing the application' });
  }
  
});


router.get("/applicants", async (req, res) => {
  try {
    const applicants = await Application.find().sort({ approved: 1 }); // Sort by 'approved' field in ascending order
 
    res.status(200).json(applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.get("/approved", async (req, res) => {
  try {
    const approvedApplicants = await Application.find({ approved: true }).sort({ approved: 1 }); // Find approved applicants and sort
 
    res.status(200).json(approvedApplicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.get("/count", async (req, res) => {
  try {
    const applicantCount = await Application.countDocuments(); // Get the count of all applicants

    res.status(200).json({ count: applicantCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.get('/approved/:formId', async (req, res) => {
  try {
    const formId = req.params.formId;
    // console.log(formId);

    // Convert the string formId to ObjectId
    const applicant = await Application.findOne({ formId: Application._id });
    // console.log(applicant)
   
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    res.status(200).json({ approved: applicant.approved });
  } catch (error) {
    console.error("Error fetching approval status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.put('/:id/action', async (req, res) => {
  const applicantId = req.params.id;
  const action = req.body.action; // Assuming the action is sent in the request body

  if (action === "approve") {
    Application.findByIdAndUpdate(applicantId, { approved: true }, { new: true })
      .then((updatedApplicant) => {
        if (!updatedApplicant) {
          return res.status(404).json({ error: "Applicant not found" });
        }

        res.json(updatedApplicant);
      })
      .catch((error) => {
        console.error("Error updating applicant:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  } else if (action === "decline") {
    Application.findByIdAndUpdate(applicantId, { approved: false }, { new: true })
      .then((updatedApplicant) => {
        if (!updatedApplicant) {
          return res.status(404).json({ error: "Applicant not found" });
        }

        res.json(updatedApplicant);
      })
      .catch((error) => {
        console.error("Error updating applicant:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
});



module.exports = router;
