import { BadgeCheck, Heart, MessageCircle, Share2, ShareIcon } from "lucide-react";
import React, { useState } from "react";
import moment from "moment";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const PostCard = ({ post }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600">$1</span>'
  );
  const [likes,setLikes]=useState(post.likes_count)
  const currentUser=dummyUserData
  const handleLike = async()=>{

  }
  const navigate= useNavigate()
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl ">
      {/* user info */}
      <div className="inline-flex items-center gap-3 cursor-pointer" onClick={()=>navigate('/profile/'+post.user._id)}>
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      {/* content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        ></div>
      )}
      {/* images */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div
          className={`grid gap-2 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((img, index) => (
            <img
              src={img}
              key={index}
              alt="Post image"
              className={`w-full rounded-lg object-cover ${
                post.image_urls.length === 1 ? "max-h-96" : "h-48"
              }`}
            />
          ))}
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
            <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4"/>    
            <span>{12}</span>
        </div>
        <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4"/>    
            <span>{7}</span>
        </div>


      </div>
    </div>
  );
};

export default PostCard;
