const express = require('express');
const router = express.Router();
const FormData = require("../schema/formSchema");

router.get('/total_applicants', (req, res) => {
  FormData.countDocuments()
    .then((count) => {
      res.json({ totalApplicants: count });
    })
    .catch((error) => {
      console.error('Error retrieving total applicants count:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
