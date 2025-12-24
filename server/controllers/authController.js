const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(username)) {
            return res.json({ success: false, message: "Tên tài khoản không được chứa ký tự đặc biệt!" });
        }
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: "Tài khoản đã tồn tại!" });
        }
        
        const newUser = new UserModel({ username, password });
        await newUser.save();

        res.json({ success: true, message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user || user.password !== password) {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }

        const accessToken = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.json({ 
            success: true, 
            message: "Đăng nhập thành công!", 
            token: accessToken, 
            user: { username: user.username } 
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};