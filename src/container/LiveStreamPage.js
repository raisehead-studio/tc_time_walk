import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import VideoIframe from "../components/VideoIframe/VideoIframe";
import { handleFetchVideoData } from "../util/api";

const LiveStreamPage = () => {
  const { videoId } = useParams();
  const [state, setState] = React.useState({
    loading: false,
    startDate: "",
    videoLink: "",
    videoName: "",
  });

  React.useEffect(() => {
    setState((state) => ({ ...state, loading: true }));
    handleFetchVideoData(videoId).then((res) => {
      setState((state) => ({ ...state, loading: false, ...res.data }));
    });
  }, [videoId]);

  return (
    <LiveStreamPageWrapper>
      <VideoIframe
        loading={state.loading}
        startDate={state.startDate}
        videoLink={state.videoLink}
        videoName={state.videoName}
      />
    </LiveStreamPageWrapper>
  );
};

const LiveStreamPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
`;

export default LiveStreamPage;
