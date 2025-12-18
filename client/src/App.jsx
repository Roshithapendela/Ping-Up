import React, { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Chatbot from "./pages/Chatbot";
import Connections from "./pages/Connections";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Createpost from "./pages/Createpost";
import Layout from "./pages/Layout";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionSlice";
import { addmessage } from "./features/messages/messagesSlice";
import Notification from "./components/Notification";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const {pathname} = useLocation();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        console.log(token);
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token))
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  useEffect(()=>{
    pathnameRef.current = pathname;
  },[pathname])


  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL +'/api/message/' + user.id);
      eventSource.onmessage=(event)=>{
          const message = JSON.parse(event.data);
          if(pathnameRef.current === ('/messages/' + message.from_user_id._id)){
            dispatch(addmessage(message))
          }else{
              toast.custom((t)=>(
                <Notification t={t} message={message} />
              ),{position:"bottom-right"})
          }
      }
      return ()=>{
        eventSource.close()
      }
    }

  },[user, dispatch])
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Chatbot />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<Createpost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
