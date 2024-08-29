import React, { createContext, useState, useRef, useEffect,useContext } from 'react';
import Peer from 'simple-peer';
import AccountContext from '../accountContext';
import { Videocam } from '@mui/icons-material';
const SocketContext = createContext();

const ContextProvider = ({ children }) => {
    const {videoCall,setVideoCall, socket,chatOfPersonOnWhichUHaveClicked,Details} = useContext(AccountContext);
  const [callAccepted, setCallAccepted] = useState(false);  // call accepted or not
  const [callEnded, setCallEnded] = useState(false);          // is call ended or not
  const [stream, setStream] = useState();
  const [name, setName] = useState('');                  //name of the person which we have called
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');          //for storing socket id
  const [idUser, setIdUser] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const getSocketId=(receiverId)=>{
    socket.current.emit('getSocketIdOfPersonYouAreCalling',receiverId);
    socket.current.on('receiverSocketId', (id) => {
      // console.log("id from fronend",id);
      setIdUser(id);

    });
  
    }
  useEffect(() => { 

      if(socket.current){ 

      socket.current.emit('getSocketId', (socketId) => {
        setMe(socketId);
      });
      //   socket.on('startVc');
      // console.log()
      socket.current.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
        console.log(call,"this is set when im receiving a call")
      });
      getSocketId(chatOfPersonOnWhichUHaveClicked.email);
    }
    }, [videoCall,socket.current]);

useEffect(() => {
  if(socket.current){
    console.log("socket set properly")
    socket.current.on('disconnected',()=>{
      console.log("got message for disconnection")
      console.log("vido call current status",videoCall)
      // if(videoCall){
        setCallEnded(true);
        setVideoCall(false);
        connectionRef.current.destroy();
        window.location.reload();
      // }
    })

  }

}, [socket.current])


const answerCall = () => {
//  !videoCall && setVideoCall(true);
  setCallAccepted(true);
  console.log("video call status from answer call",videoCall)

  
   //  initiator false means we are not initiating this call, we are just picking it up
   const peer = new Peer({ initiator: false, trickle: false, stream });        // we are getting stream from use effect
   
   // creating a signal
   peer.on('signal', (data) => {
    //  console.log("peer",data);
     socket.current.emit('answerCall', { signal: data, to: call.from });
    });
    
    // setting the video of other person on screen
    peer.on('stream', (currentStream) => {
      console.log("just see this",currentStream);
      userVideo.current.srcObject = currentStream;
    });
    
    peer.signal(call.signal);
    console.log("call answered",call)
    connectionRef.current = peer;

  };
  // getting socket id of the person which you are calling

//   calling a user
// that id which is written just below which is passed as a arguement to callUser is the socket id of the person we are calling
  const callUser = () => {

    //  const id=getSocketId(chatOfPersonOnWhichUHaveClicked.email);
    //  console.log("see now",id)
    
    console.log("calling function call user",chatOfPersonOnWhichUHaveClicked.email)
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      // console.log(peer);
      socket.current.emit('callUser', { userToCall: idUser, signalData: data, from: me, name:Details.name });
    });
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.current.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    let email=chatOfPersonOnWhichUHaveClicked.email;

    socket.current.emit("callEnded",email); //telling the receiver that the call has ended
      
    
    setCallEnded(true);
    connectionRef.current.destroy();
    setVideoCall(false);
    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      setStream,
      setCallEnded,
   
    }}
    > 
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

