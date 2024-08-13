import React,{useContext, useEffect} from 'react';
import { Box, styled } from '@mui/material'
import newLogo from '../../../images/newLogo.png'
import { SocketContext } from '../../../context/contextForVc/VcContext';
import Options from './Options';
const BoxUser=styled(Box)`
position:absolute;
bottom: 10px;
    right: 30px;
    & > video {
        height:100px;
        width:100px;
        border-radius:15px;
    }
`
const VideoUi = () => {
    const { setStream, callAccepted, myVideo, userVideo, callEnded, stream } = useContext(SocketContext);
    useEffect(() => {
    
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
    
                // Ensure the video element is available
                if (myVideo.current) {
                    console.log("Setting the stream to my video element");
                    myVideo.current.srcObject = currentStream;
                } else {
                    console.log("Video element is not available yet, setting a timeout");
    
                    // Retry after a short delay if the ref is not yet available
                    const checkVideoRef = setTimeout(() => {
                        if (myVideo.current) {
                            console.log("Setting the stream to my video element after delay");
                            myVideo.current.srcObject = currentStream;
                        } else {
                            console.log("Video element is still not available after delay");
                        }
                    }, 100); // Adjust delay as necessary
    
                    // Clear timeout if component unmounts or ref becomes available
                    return () => clearTimeout(checkVideoRef);
                }
            })
            .catch((error) => {
                console.log("Error accessing media devices:", error);
            });
    }, [myVideo]);
    
// useEffect(() => {
//     if (myVideo.current && stream) {
//       myVideo.current.srcObject = stream;
//     }
//   }, [myVideo, stream]);
  
//   useEffect(() => {
//     if (userVideo.current && stream) {
//       userVideo.current.srcObject = stream;
//     }
//   }, [userVideo, stream,callAccepted]);
  return (
   

    <div>
         <div className="header">
            <nav>
                <img src={newLogo} className="logo"/>
                {/* <ul>
                    <li><img alt='img' src="https://i.postimg.cc/L8zxQBhv/live.png" className="activeCall"/></li>
                    <li><img alt='img' src="https://i.postimg.cc/JnggC78Q/video.png"/></li>
                    <li><img alt='img' src="https://i.postimg.cc/vmb3JgVy/message.png"/></li>
                    <li><img alt='img' src="https://i.postimg.cc/qR7Q7PwZ/notification.png"/></li>
                    <li><img alt='img' src="https://i.postimg.cc/k4DZH604/users.png"/></li>
                    <li><img alt='img' src="https://i.postimg.cc/v84Fqkyz/setting.png"/></li>
                </ul> */}
            </nav>
            <div className="container">
                <div className="top-icons">
                    {/* <img src="https://i.postimg.cc/cCpcXrSV/search.png"/> */}
                    <img src="https://i.postimg.cc/Pqy2TXWw/menu.png"/>
                </div>
                <div className="row">
                    <div className="col-1">
                        {/* other person's video */}
                       
{/* <img src="https://i.postimg.cc/521rVkhD/image.png" alt="" className="host-img" /> */}

{/*  if the call is accepted and the call is not ended */}

       { callAccepted && !callEnded  &&  <video alt="your friend's video" playsInline ref={userVideo} autoPlay className="host-img"  />
                        }

                            <Options/>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* our won video */}
{stream &&      <BoxUser>
            <video playsInline muted ref={myVideo} autoPlay  />
            </BoxUser>}
        </div>
    
    
    
  )
}

export default VideoUi