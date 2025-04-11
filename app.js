const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { authRoutes, userRoutes, transferRoutes } = require("./routes");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/", (req, res) => console.log("server connection successful!"));

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log("error", err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
