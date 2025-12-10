import React from "react";
import { useState, useEffect } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feeds, Setfeeds] = useState([]);
  const [loading, Setloading] = useState(true);
  const fetchFeeds = async () => {
    Setfeeds(dummyPostsData);
    Setloading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-auto no-scrollbar flex items-start gap-6 pl-30 pr-6 py-6">
      {/* Stories and Posts Column */}
      <div className="max-w-2xl w-full space-y-6">
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post)=>(
            <PostCard key={post._id} post={post}/>
          ))}
        </div>
      </div>

      {/* { Rightside Advertisement} */}
      <div className='max-xl:hidden top-0 sticky'>
        <div className="max-w-xs bg-white text-xs p-4 roundedd-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img src={assets.sponsored_img} alt="" className="w-75 h-50 rounded-md" />
          <p className="text-slate-600">Email Marketing</p>
          <p className="text-slate-400">Supercharge your marketing with a powerful, easy-to-use platform for results.</p>
        </div>
          <RecentMessages/>
        </div>
      </div>
    
  ) : (
    <Loading />
  );
};

export default Feed;
