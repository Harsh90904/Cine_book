const express = require("express");
const sequelize = require("./config/DB");
const cors = require("cors");
const userRouter = require("./routers/User.R");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
  console.log(`server running on port ${PORT}`);
  sequelize.authenticate().then(() => {
    console.log("DB connected");
  }).catch((err) => {
    console.log("Error: ", err);
  });
});