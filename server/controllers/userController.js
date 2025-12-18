import imagekit from "../configs/imageKit.js";
import User from "../modals/User.js";
import Connection from "../modals/Connection.js";
import fs from "fs";

// Get user data using userId
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    let user = await User.findById(userId);

    // If user doesn't exist, create a basic user profile
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
      return res.json({
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

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (existingConnection) {
      return res.json({
        success: false,
        message: "Connection request already exists",
      });
    }

    // Create connection request
    const connection = await Connection.create({
      from_user_id: userId,
      to_user_id: id,
      status: "pending",
    });

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

    // Find the connection request
    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
      status: "pending",
    });

    if (!connection) {
      return res.json({
        success: false,
        message: "Connection request not found",
      });
    }

    // Update connection status to accepted
    connection.status = "accepted";
    await connection.save();

    // Add to both users' connections array
    await User.findByIdAndUpdate(userId, { $addToSet: { connections: id } });
    await User.findByIdAndUpdate(id, { $addToSet: { connections: userId } });

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
    const user = await User.findById(userId)
      .populate("connections", "full_name username profile_picture bio")
      .populate("followers", "full_name username profile_picture bio")
      .populate("following", "full_name username profile_picture bio");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Get pending connection requests
    const pendingConnections = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id", "full_name username profile_picture bio");

    res.json({
      success: true,
      connections: user.connections || [],
      followers: user.followers || [],
      following: user.following || [],
      pendingConnections: pendingConnections.map((conn) => conn.from_user_id),
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get user profiles
export const getUserProfiles = async (req, res) => {
  try {
    const { profileId, userIds } = req.body;

    // Handle single profile request
    if (profileId) {
      const profile = await User.findById(profileId);
      if (!profile) {
        return res.json({ success: false, message: "User not found" });
      }

      // Get posts by this user
      const Post = (await import("../modals/Post.js")).default;
      const posts = await Post.find({ user: profileId })
        .populate("user", "full_name username profile_picture is_verified")
        .sort({ createdAt: -1 });

      return res.json({ success: true, profile, posts });
    }

    // Handle multiple profiles request
    if (userIds) {
      const users = await User.find({ _id: { $in: userIds } }).select(
        "full_name username profile_picture"
      );
      return res.json({ success: true, users });
    }

    return res.json({
      success: false,
      message: "No profileId or userIds provided",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
