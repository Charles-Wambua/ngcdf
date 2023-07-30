const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const form = require("./route/formDetails") 
const students=require("./route/UniApplicants")
const applicants=require("./route/TotalApplicants")
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: "https://machakoscdf.onrender.com"
}));
// const corsOptions = {
//   origin: 'http://192.168.0.10', 
//   optionsSuccessStatus: 200,
// };

app.use(cors(corsOptions));
// app.use("/get", form)
app.use("/form",form) 
app.use("/applicants", applicants) 
app.use("/students", students)

mongoose
  .connect("mongodb+srv://charles:charlie98@cdf.0bwz5ly.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed: " + error);
  });
port= process.env.PORT||3001
app.listen(port,()=>console.log(`App running on port ${port}`))