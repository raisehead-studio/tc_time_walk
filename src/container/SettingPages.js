import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";

import InputArea from "../components/InputArea/InputArea";
import VideoList from "../components/VideoList/VideoList";
import { handleUpdateData, handleFetchData } from "../util/api";
import firebase from "../util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const SettingPage = (props) => {
  const { user } = props;
  const history = useHistory();
  const { isAdmin } = useSelector((state) => state.user);
  const [state, setState] = React.useState({
    isLoading: false,
    videoListData: {},
  });

  const handleUpdate = async (data) => {
    setState((state) => ({ ...state, isLoading: true }));
    await handleUpdateData(data).then((res) => {
      setState((state) => ({ ...state, isLoading: false }));
      handleGetData();

      return data;
    });
  };

  const handleGetData = async () => {
    setState((state) => ({ ...state, isLoading: true }));
    await handleFetchData().then((res) => {
      setState((state) => ({
        ...state,
        videoListData: res.data,
        isLoading: false,
      }));
    });
  };

  React.useEffect(() => {
    if (!isAdmin && user) {
      history.push(`/event_list/${user.multiFactor.user.uid}`);
    }
    handleGetData();
  }, [isAdmin, user]);

  return (
    <SettingWrapper>
      <InputArea handleGetData={handleGetData} />
      <VideoList
        loading={state.isLoading}
        videoListData={state.videoListData}
      />
    </SettingWrapper>
  );
};

const SettingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(SettingPage);
