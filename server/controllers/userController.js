const UserModel = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.json(err);
    }
};