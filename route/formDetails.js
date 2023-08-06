const express = require("express");
const router = express.Router();
const FormData = require("../schema/formSchema");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

router.get("/get/:id", (req, res) => {
  const formId = req.params.id;
  console.log(formId)
  
  FormData.findById(formId)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Form not found" });
      }
    })
    .catch((error) => {
      console.error("Error retrieving form data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/post", (req, res) => {
  const formData = req.body;
  console.log(formData);
  formData.approved = false;

  FormData.create(formData)
    .then((createdForm) => {
      console.log("Form data saved successfully");
      res.json({ id: createdForm._id, message: "Form submitted successfully" });
    })
    .catch((error) => {
      console.error("Error saving form data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
// Assume your backend route is "/students"

// Route to update the approval status for a specific applicant
router.put("/approve-applicant/:id", (req, res) => {
  const applicantId = req.params.id;

  // Find the applicant by ID and update the approval status to true
  FormData.findByIdAndUpdate(applicantId, { approved: true }, { new: true })
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
});
router.put("/decline-applicant/:id", (req, res) => {
  const applicantId = req.params.id;

  // Find the applicant by ID and update the approval status to true
  FormData.findByIdAndUpdate(applicantId, { approved: false }, { new: true })
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
});
function generatePdf(formData) {
  const doc = new PDFDocument();

  // Set up the PDF document
  doc.fontSize(12);
  // Add form data to the PDF
  doc.text(`Name: ${formData.name}`);
  doc.text(`Gender: ${formData.gender}`);
  doc.text(`Adm Reg No: ${formData.admRegNo}`);
  doc.text(`Application Date: ${formData.applicationDate}`);
  doc.text(`Course Duration: ${formData.courseDuration}`);
  doc.text(`Email: ${formData.email}`);
  doc.text(`Family Status: ${formData.familyStatus}`);
  doc.text(`Father's Income: ${formData.fatherIncome}`);
  doc.text(`ID: ${formData.id}`);
  doc.text(`Institution: ${formData.institution}`);
  doc.text(`Mobile Number: ${formData.mobileNumber}`);
  doc.text(`Mother's Income: ${formData.motherIncome}`);
  doc.text(`Semester: ${formData.semester}`);
  doc.text(`Study Level: ${formData.studyLevel}`);
  doc.text(`Study Mode: ${formData.studyMode}`);
  doc.text(`Study Year: ${formData.studyYear}`);
  doc.text(`Sub Location: ${formData.subLocation}`);
  doc.text(`Ward: ${formData.ward}`);

 

   // Generate a unique file name for the PDF
  const fileName = `${uuidv4()}.pdf`;
  const folderPath = 'D:/DoneWithIt/app/assets/';
  // Create the complete file path
  const filePath = path.join(folderPath, fileName);
  doc.pipe(fs.createWriteStream(filePath));
  doc.end();

  return filePath;
}
router.get("/get/:id/download", async (req, res) => {
  try {
    const formId = req.params.id;

    const data = await FormData.findById(formId);

    if (data) {
      const pdfPath = await generatePdf(data);

      setTimeout(() => {
        const fileStream = fs.createReadStream(pdfPath);
        const stat = fs.statSync(pdfPath);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=form.pdf'); 

        fileStream.pipe(res);

        fileStream.on('error', (err) => {
          console.error("Error sending file:", err);
          res.status(500).json({ error: "Internal server error" });
        });

        fileStream.on('close', () => {
          console.log("File sent successfully");
        });
      }, 5000); 

    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    console.error("Error retrieving form data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

