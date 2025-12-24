const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const URI = process.env.MONGO_URI;
mongoose
  .connect(URI)
  .then(() => console.log("Đã kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối:", err));

app.get("/", (req, res) => {
  res.send("Server đang chạy ngon lành!");
});

app.use("/api", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running...");
});
