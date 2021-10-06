import React from "react";
import styled from "styled-components";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../util/firebase";
import withFirebaseAuth from "react-with-firebase-auth";
import Send from "@material-ui/icons/Send";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";

import firebase from "../../util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const Chatroom = (props) => {
  const chatRef = React.useRef();
  const chatRefItem = React.useRef();

  const { eventId, user } = props;
  const [state, setState] = React.useState({
    message: "",
    messageList: [],
    isChatroomClose: false,
  });

  const scrollToBottom = () => {
    const childHeight = chatRefItem.current.getBoundingClientRect().height;
    const h = chatRef.current.getBoundingClientRect().height;
    console.log();

    chatRef.current.scrollTo({
      top: h + childHeight * state.messageList.length,
      behavior: "smooth",
    });
  };

  const handleGetMessage = async () => {
    const msgRef = collection(db, eventId);
    const q = query(msgRef, orderBy("ts"), limit(200));
    onSnapshot(q, (doc) => {
      const updateMessageList = [];

      doc.forEach((msg) => {
        updateMessageList.push({
          ...msg.data(),
        });
      });

      setState((state) => ({ ...state, messageList: updateMessageList }));
    });
  };

  const handleSendMessage = async () => {
    try {
      if (user) {
        setState((state) => ({ ...state, message: "" }));

        const { photoURL } = user.multiFactor.user.auth.currentUser;
        const { uid } = user.multiFactor.user;

        const docRef = await addDoc(collection(db, eventId), {
          message: state.message,
          uid: uid,
          photoURL: photoURL,
          ts: new Date().getTime(),
        });
        console.log("Document written with ID: ", docRef.id);
        scrollToBottom();
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateField = (e) => {
    const { value, name } = e.target;
    setState((state) => ({ ...state, [name]: value }));
  };

  const keyPressUpdate = (e) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const handleToggleChatroom = () =>
    setState((state) => ({
      ...state,
      isChatroomClose: !state.isChatroomClose,
    }));

  React.useEffect(() => {
    handleGetMessage();
  }, []);

  React.useEffect(() => {
    if (chatRef) {
      console.log();
    }
  }, [state.messageList]);

  return (
    <ChatRoomsWrapper>
      <MessageContainer ref={chatRef} isChatroomClose={state.isChatroomClose}>
        {state.messageList.map((msg) => (
          <MessageItem
            isSelf={msg.uid === user.multiFactor.user.uid}
            ref={chatRefItem}
          >
            <MessageIconContainer>
              {msg.photoURL ? (
                <MessageIcon src={msg.photoURL} alt={"photo"} />
              ) : (
                <AccountCircle />
              )}
            </MessageIconContainer>
            <Message>{msg.message}</Message>
          </MessageItem>
        ))}
      </MessageContainer>
      <BottomContainer>
        <InputContainer>
          <Inputs
            onKeyDown={(e) => keyPressUpdate(e)}
            onChange={updateField}
            name="message"
            value={state.message}
          />
          <SendIcon onClick={handleSendMessage} />
        </InputContainer>
        <CollapseIconContainer>
          {!state.isChatroomClose ? (
            <ArrowDropDown onClick={handleToggleChatroom} />
          ) : (
            <ArrowDropUp onClick={handleToggleChatroom} />
          )}
        </CollapseIconContainer>
      </BottomContainer>
    </ChatRoomsWrapper>
  );
};

const ChatRoomsWrapper = styled.div`
  position: absolute;
  width: 500px;
  /* height: 700px; */
  background-color: #fff;
  z-index: 200;
  bottom: 30px;
  left: 30px;
  padding: 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const MessageContainer = styled.div`
  max-height: 700px;
  height: ${(p) => (p.isChatroomClose ? "600px" : "0px")};
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  transition: 0.2s height linear;
`;

const MessageItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(p) => (p.isSelf ? "row" : "row-reverse")};
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
`;

const Message = styled.p`
  color: #7a7a7a;
  font-size: 14px;
`;

const MessageIconContainer = styled.div`
  padding: 0px 5px;
  width: 40px;
  height: 40px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageIcon = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 25px;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: #ececec;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Inputs = styled.input`
  width: 85%;
  border-style: none;
  height: 30px;
  background-color: #ececec;
  margin-left: 5%;

  &:focus {
    outline: none;
  }
`;

const SendIcon = styled(Send)`
  cursor: pointer;
  width: 10%;
  color: #7a7a7a;
  padding-left: 5px;
`;

const CollapseIconContainer = styled.div`
  min-width: 30px;

  .MuiSvgIcon-root {
    cursor: pointer;
  }
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Chatroom);
