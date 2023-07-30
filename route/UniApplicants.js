const express = require('express');
const router = express.Router();
const FormData = require('../schema/formSchema')


router.get("/get-all-applicants", (req, res) => {
  FormData.find({})
    .sort({ _id: -1 }) 
    .then((allFormData) => {
      if (!allFormData || allFormData.length === 0) {
        return res.status(404).json({ error: "No form data found" });
      }

      res.json(allFormData);
    })
    .catch((error) => {
      console.error("Error retrieving form data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/approved-applicants", (req, res) => {
  FormData.find({ approved: true })
    .then((approvedApplicants) => {
      if (!approvedApplicants || approvedApplicants.length === 0) {
        return res.status(404).json({ error: "No approved applicants found" });
      }

      res.json(approvedApplicants);
    })
    .catch((error) => {
      console.error("Error fetching approved applicants:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});


module.exports = router;
