import React from "react";
import styled from "styled-components";

import InputArea from "../components/InputArea/InputArea";
import VideoList from "../components/VideoList/VideoList";
import { handleUpdateData, handleFetchData } from "../util/api";

const SettingPage = () => {
  const [state, setState] = React.useState({
    isLoading: false,
    videoListData: {},
  });

  const handleUpdate = async (data) => {
    setState((state) => ({ ...state, isLoading: true }));
    await handleUpdateData(data).then((res) => {
      setState((state) => ({ ...state, isLoading: false }));
      handleGetData();
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
    handleGetData();
  }, []);

  return (
    <SettingWrapper>
      <InputArea handleUpdate={handleUpdate} />
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

export default SettingPage;
