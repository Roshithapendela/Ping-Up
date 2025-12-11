import React from 'react'
import { Routes , Route} from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Chatbot from './pages/Chatbot'
import Connections from './pages/Connections'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Createpost from './pages/Createpost'
import Layout from './pages/Layout'
import { useUser, useAuth } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'

const App = () => {
  const {user}=useUser();
  const {getToken}=useAuth();
  useEffect(()=>{
    getToken().then((token)=>console.log(token))
    console.log(user)
  },[user])
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path="/" element={!user? <Login/>:<Layout/>}>
        <Route index element={<Feed/>}/>
        <Route path="messages" element={<Messages/>}/>
        <Route path="messages/:userId" element={<Chatbot/>}/>
        <Route path="connections" element={<Connections/>}/>
        <Route path="discover" element={<Discover/>}/> 
        <Route path="profile" element={<Profile/>}/>
        <Route path="profile/:profileId" element={<Profile/>}/>
        <Route path="create-post" element={<Createpost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
