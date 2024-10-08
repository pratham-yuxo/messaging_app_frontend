import React, { useEffect, useState, useRef } from "react";
import AccountContext from "../accountContext";
//socket io stuff
import { io } from "socket.io-client";

const AccountState = (props) => {
  const [Details, setDetails] = useState(null);
  const [chatOfPersonOnWhichUHaveClicked, setchatOfPersonOnWhichUHaveClicked] =
    useState([]);
  const [loaderf, setloaderf] = useState(false);
  const [msgflag, setmsgflag] = useState(false); //for displaying new msgs
  // for handling of dialog box
  const [dialogbox, setDialogbox] = useState(false);
  // to store the list of active users
  const [activeUsers, setactiveUsers] = useState([]);
  const [darkMode, setdarkMode] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const socket = useRef();
  const backendUrl=process.env.REACT_APP_BACKEND_SOCKET_URL || "ws://localhost:5000";
  useEffect(() => {
    // socket.current = io("ws://localhost:5000"); //address of backend where server of socket is running
    socket.current = io(backendUrl); //address of backend where server of socket is running
  }, []);
  useEffect(() => {
    console.log("State updated:", videoCall);
}, [videoCall]);

  return (
    <AccountContext.Provider
      value={{
        Details,
        setDetails,
        chatOfPersonOnWhichUHaveClicked,
        setchatOfPersonOnWhichUHaveClicked,
        socket,
        activeUsers,
        setactiveUsers,
        loaderf,
        setloaderf,
        msgflag,
        setmsgflag,
        setDialogbox,
        dialogbox,
        darkMode,
        setdarkMode,
        videoCall,
        setVideoCall,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState;
