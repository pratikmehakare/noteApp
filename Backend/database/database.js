const mongoose = require("mongoose");
require('dotenv').config();

const DBConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("DB Connected..");
    })
    .catch((e) => {
      console.error("DB Connection Error:", e);
    });
}

module.exports = DBConnect;
