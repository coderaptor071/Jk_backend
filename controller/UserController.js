const userLoginInfo = require("../models/User.js");

const userController = async (username) => {
  try {
    let userInfo = await userLoginInfo.find({ 'username': username });

    return userInfo;
  }
  catch (err) {
    res.json({ message: err.message });
  }
};


module.exports = { userController };
