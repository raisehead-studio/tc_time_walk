import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import Swal from "sweetalert2";

import InputArea from "../components/InputArea/InputArea";
import AdminEventList from "../components/AdminEventList/AdminEventList";
import {
  handleUpdateData,
  handleFetchData,
  handleDeleteEvent,
} from "../util/api";
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

  const handleDelEvent = (event_name, event_id) => {
    Swal.fire({
      html: `<div style="display:flex; justify-content: flex-start; text-align: center">
          <p>確定刪除${event_name}?</p>
          </div>`,
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "取消",
    }).then(async (result) => {
      const { value } = result;
      if (value) {
        await handleDeleteEvent(event_id);
        handleGetData();
      }
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
      <AdminEventList
        loading={state.isLoading}
        videoListData={state.videoListData}
        handleGetData={handleGetData}
        handleDelEvent={handleDelEvent}
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
