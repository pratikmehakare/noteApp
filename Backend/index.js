const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8000;



app.use(cors({ origin: "*" }));
app.use(express.json());

const DBConnect = require("./database/database");
DBConnect();

const route = require("./routes/route")
app.use("/api/v1",route);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
