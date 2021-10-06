import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import VideoIframe from "../components/VideoIframe/VideoIframe";
import { useDispatch, useSelector } from "react-redux";

import { handleFetchEventDetail } from "../redux/events";

const LiveStreamPage = () => {
  const { videoId } = useParams();
  const { eventDetail, eventDetailLoading } = useSelector(
    (state) => state.events
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(handleFetchEventDetail(videoId));
  }, [videoId]);

  return (
    <LiveStreamPageWrapper>
      <VideoIframe
        eventId={videoId}
        loading={eventDetailLoading}
        endDate={eventDetail.endDate}
        startDate={eventDetail.startDate}
        videoLink={eventDetail.eventLink}
        videoName={eventDetail.eventName}
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
