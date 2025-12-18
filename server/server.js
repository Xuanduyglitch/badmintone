const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const UserModel = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const URI = process.env.MONGO_URI;
mongoose.connect(URI)
  .then(() => console.log('Đã kết nối MongoDB thành công!'))
  .catch(err => console.log('Lỗi kết nối:', err));


app.get('/', (req, res) => {
  res.send('Server đang chạy ngon lành cành đào!');
});

app.get('/getUsers', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    res.json(err);
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log("📥 Đang đăng nhập với user:", username);

  try {
    const user = await UserModel.findOne({ username: username });
    console.log("Kết quả tìm trong MongoDB:", user); 

    if (!user) {
      return res.json({ success: false, message: "Tài khoản không tồn tại!" });
    }
    if (user.password !== password) {
      return res.json({ success: false, message: "Sai mật khẩu rồi!" });
    }
    res.json({ success: true, message: "Đăng nhập thành công!", user: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const regex = /^[a-zA-Z0-9]+$/; // Chỉ cho chữ và số
    if (!regex.test(username)) {
      return res.json({ success: false, message: "Tên tài khoản không được chứa ký tự đặc biệt hoặc dấu cách!" });
    }
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: "Tài khoản đã tồn tại!" });
    }
    const newUser = new UserModel({ username, password });
    await newUser.save();
    
    console.log("Đã tạo user mới:", username);
    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running...");
});