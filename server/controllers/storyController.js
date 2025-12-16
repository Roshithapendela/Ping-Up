import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../modals/Story.js";
import User from "../modals/User.js";
//add user story
export const addUserStory = async (req, res) => {
  try {
    const userId = req.userId;
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";
    //uploading media to imagekit
    if (media_type == "image" || media_type == "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }
    //create story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//get user stories
export const getStories = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    //user connections and following
    const userIds = [userId, ...user.connections, ...user.following];
    const stories = await Story.find({
      user: { $in: userIds },
    })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, stories });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
