import React, { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const StoriesBar = () => {
  const {getToken} = useAuth();
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    try {
      const token = await getToken();
      const {data} = await api.get('/api/story/get' , {
        headers:{Authorization:`Bearer ${token}`}
      })
      if(data.success){
        setStories(data.stories || []);
      }else{
        // Only show error if it's not a "user not found" case
        if(data.message && !data.message.toLowerCase().includes('user not found')){
          toast.error(data.message);
        }
      }
      
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Don't show toast for network errors on initial load
      
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full  rounded-xl shadow-sm p-4 mb-6">
      <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory">
        <div className="flex gap-4 pb-2 items-stretch">
          {/* {Add story card} */}
          <div
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 w-36 snap-start rounded-lg shadow-sm aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
          >
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-slate-700 text-center">
                Create Story
              </p>
            </div>
          </div>
          {/* {Story Cards} */}
          {stories.map((story, index) => (
            <div
              onClick={() => setViewStory(story)}
              key={index}
              className={`flex-shrink-0 w-36 snap-start relative rounded-lg shadow cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 aspect-[3/4] overflow-hidden`}
            >
              <img
                src={story.user.profile_picture}
                alt=""
                className="absolute w-8 h-8 top-3 left-3 z-10 rounded-full ring ring-gray-500 shadow"
              />
              <p className="absolute top-12 left-3 text-white/60 text-sm truncate max-w-[110px]">
                {story.content}
              </p>
              <p className="text-white absolute bottom-1 right-2 z-10 text-xs">
                {moment(story.createdAt).fromNow()}
              </p>
              {story.media_type !== "text" && (
                <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                  {story.media_type === "image" ? (
                    <img
                      src={story.media_url}
                      alt="Image"
                      className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                    />
                  ) : (
                    <video
                      src={story.media_url}
                      className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                    ></video>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* {Stories } */}
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
      )}
      {/* {View Story} */}

      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
