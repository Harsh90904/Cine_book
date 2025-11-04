const express = require("express");
const sequelize = require("./config/DB");
const cors = require("cors");
const userRouter = require("./routers/User.R");
const movieRouter = require("./routers/Movie.R");
const ThaterRouter = require("./routers/Thater.R");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user", userRouter);
app.use("/movie", movieRouter)
app.use("/", ThaterRouter)
const PORT = process.env.PORT || 3000;

// Sync models (create/alter tables) then start server
sequelize.sync({ alter: true }) // use { force: true } to drop+recreate
  .then(() => {
    console.log("Database synced");
    return sequelize.authenticate();
  })
  .then(() => {
    console.log("DB connection OK");
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to start server:", err);
    process.exit(1);
  });