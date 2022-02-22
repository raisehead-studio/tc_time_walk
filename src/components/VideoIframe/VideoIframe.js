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
          <VideoListWrapper>
            <Iframe
              isVideo
              src={`https://www.youtube.com/embed/${videoLink.split("/")[3]}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <Iframe
              isChatroom
              src={`https://www.youtube.com/live_chat?v=${
                videoLink.split("/")[3]
              }&embed_domain=tctimewalkadmin.web.app`}
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
        <VideoListWrapper no_start>
          <NotStartedText>活動尚未開始</NotStartedText>
        </VideoListWrapper>
      );
    }
  }
};

const VideoListWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.no_start ? "center" : "stretch")};
  width: 100vw;
  height: calc(100vh - 50px);
  transform: translateY(50px);

  @media (max-width: 460px) {
    flex-direction: column;
    height: calc(100vh - 120px);
  }
`;

const Iframe = styled.iframe`
  width: ${(p) => (p.isChatroom ? "30%" : "70%")};
  height: calc(100vh - 50px);
  @media (max-width: 460px) {
    width: 100%;
    height: ${(p) => p.isChatroom};
  }
`;

const NotStartedText = styled.p`
  font-size: 30px;
  color: #777777;
  font-weight: 600;
`;

export default VideoIframe;
