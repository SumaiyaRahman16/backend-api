const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const userRoute = require('./routes/user');
const userAuth = require('./routes/auth');
const productRoute = require('./routes/product');

dotenv.config(); 

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());




app.use("/api/user", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/products", productRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
