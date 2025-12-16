import imagekit from "../configs/imageKit.js";
import User from "../modals/User.js";
import fs from "fs";

// Get user data using userId
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Update user data

export const updateUserData = async (req, res) => {
  try {
    const userId = req.userId;
    let { username, bio, full_name, location } = req.body;

    const tempUser = await User.findById(userId);
    !username && (username = tempUser.username);
    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        //dont change username
        username = tempUser.username;
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    res.json({ success: true, user, message: "Profile Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//find user by username ,email, location , bio ,,,

export const discoverUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredusers = allUsers.filter((user) => user._id !== userId);
    res.json({ success: true, users: filteredusers });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Follow User
export const followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      res.json({
        success: false,
        message: "You are already following this user",
      });
    }
    user.following.push(id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();
    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();
    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter((user) => user !== userId);
    await toUser.save();

    res.json({
      success: true,
      message: "Now you are no longer following this user",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    // TODO: Implement connection request logic
    res.json({ success: true, message: "Connection request sent" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    // TODO: Implement accept connection logic
    res.json({ success: true, message: "Connection request accepted" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get user connections
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.userId;
    // TODO: Implement get connections logic
    res.json({ success: true, connections: [] });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get user profiles
export const getUserProfiles = async (req, res) => {
  try {
    const { userIds } = req.body;
    // TODO: Implement get profiles logic
    const users = await User.find({ _id: { $in: userIds } }).select(
      "name username profile_img"
    );
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
