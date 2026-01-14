const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const userRoute = require('./routes/user');

dotenv.config(); // This loads the .env file

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
