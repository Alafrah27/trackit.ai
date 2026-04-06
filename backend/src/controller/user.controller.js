// register with firebase googleprovider and facebookprovider

import User from "../modal/user.modal.js";

export const registerUser = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const userId = req.user.uid;
    const user = await User.findOne({ firebaseUserId: userId });
    if (!user) {
      const newUser = new User({
        firebaseUserId: userId,
        email,
        name, 
        avatar,
      });
      const savedUser = await newUser.save();
      if (!savedUser) {
        return res.status(400).json({
          success: false,
          message: "User not registered",
        });
      }
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: savedUser,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User already exists",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
