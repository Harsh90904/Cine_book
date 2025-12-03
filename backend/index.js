const express = require("express");
const sequelize = require("./config/DB");
const cors = require("cors");
const userRouter = require("./routers/User.R");
const movieRouter = require("./routers/Movie.R");
const ThaterRouter = require("./routers/Thater.R");
const BookingRouter = require("./routers/booking.R");
const SeatRouter = require("./routers/seat.R");
const ScreenRouter = require("./routers/screen.R");
const ShowRouter = require("./routers/Show.R");
const assignAssociations = require("./models");
const path = require("path");
require("dotenv").config();
//assignAssociations();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user", userRouter);
app.use("/movie", movieRouter)
app.use("/thater", ThaterRouter)
app.use("/booking", BookingRouter);
app.use("/seat", SeatRouter);
app.use("/screen", ScreenRouter);
app.use("/show", ShowRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8090;

sequelize.sync({ alter: true })
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