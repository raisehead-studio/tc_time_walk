import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";

import Chatroom from "../../components/Chatroom/Chatroom";

import Spinner from "../Spinner/Spinner";

const VideoIframe = ({
  loading,
  startDate,
  endDate,
  videoLink,
  videoName,
  eventId,
}) => {
  const current = new Date().getTime();
  if (loading) {
    return <Spinner />;
  } else {
    if (endDate > current && current > startDate) {
      // if (true) {
      return (
        <React.Fragment>
          <Chatroom eventId={eventId} />
          <VideoListWrapper>
            <Iframe
              src={`https://www.youtube.com/embed/${
                videoLink.split("v=")[videoLink.split("v=").length - 1]
              }`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </VideoListWrapper>
        </React.Fragment>
      );
    } else {
      return (
        <VideoListWrapper>
          <NotStartedText>活動尚未開始</NotStartedText>
        </VideoListWrapper>
      );
    }
  }
};

const VideoListWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90vh;
  transform: translateY(70px);
  @media (max-height: 500px) {
    transform: translateY(55px);
    height: calc(100vh - 55px);
  }
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100vh;
  @media (max-height: 500px) {
    height: calc(100vh - 55px);
  }
`;

const NotStartedText = styled.p`
  font-size: 30px;
  color: #777777;
  font-weight: 600;
`;

export default VideoIframe;
