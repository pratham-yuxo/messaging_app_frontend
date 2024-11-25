import React, { useContext, useEffect, useState } from 'react'
import ChatBox from "./RightSection/ChatBox"
import LeftSideBar from "./LeftBar/chatListSection/LeftSideBar"
import EmptyChat from './RightSection/EmptyChat'
import AccountContext from '../context/accountContext'
import { useNavigate } from 'react-router-dom'
import { fetchDetails } from '../allApis/forAdding'
import VideoUi from './RightSection/VideoCallSection.js/VideoUi'
import { ContextProvider } from '../context/contextForVc/VcContext'
import Notifications from './RightSection/VideoCallSection.js/Notifications'
import { CircularProgress } from '@mui/material'

const Home = () => {

  let history = useNavigate();
  const {videoCall, darkMode, setDetails, Details, chatOfPersonOnWhichUHaveClicked, loader, socket } = useContext(AccountContext);
  const chat = {
    "width": "70%",
    "minWidth": "501px",
    "height": "100%",
    position:"relative",
    "borderLeft": `1px solid ${darkMode ? "#000000" : "rgba(0,0,0,0.2)"} !important`,
    flex: '1'
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      if (localStorage.getItem('token')) {
        let details;

        details = await fetchDetails();
        setDetails(details);
        setLoading(false);
        if (!details) {
          history('/login');
        }
      } else {
        setLoading(false);
        history('/login');
      }
    }
    fun();
  }, [])

  useEffect(() => {
    socket.current?.connect();

  }, [])

  const sideBar = {
    "maxWidth": "45%",
    "minWidth": "336px",
    "width": "400px",
    "height": "100vh",
    "background": `${darkMode ? '#111b21' : '#fff'}`,
    pointerEvents: `${loader ? 'none' : 'auto'}`,
    position:"relative"

  }
  const upperDiv = {
    "display": "flex",
    opacity: `${loader ? '.9' : '1'}`,
  }
  return (
    <div >
      <ContextProvider>
      <Notifications/>
    { videoCall &&   <VideoUi/>}
    </ContextProvider>
      {Details && !videoCall && <div style={upperDiv}>

        <div style={sideBar}>
          <LeftSideBar />

        </div>

        <div style={chat}>
        
          {Object.keys(chatOfPersonOnWhichUHaveClicked).length ? <ChatBox /> : <EmptyChat />}
        </div>

        {/* Object.keys() --> will give you all the keys of your object ,if nothing is present then it will return a zero otherwise list of keys */}
      </div>}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{
            display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}>

          <CircularProgress />
          Wait for few seconds because backend is deployed on free tier which takes time to render first time
          </div>
        </div>
      )}
    </div>
  )
}

export default Home