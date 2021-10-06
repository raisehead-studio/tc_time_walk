import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Modal from "@material-ui/core/Modal";
import LinkIcon from "@material-ui/icons/Link";
import Info from "@material-ui/icons/Info";

import Spinner from "../Spinner/Spinner";

const VideoList = ({ loading, videoListData = {} }) => {
  const [state, setState] = React.useState({
    isModalOpen: false,
    infoId: "",
  });
  const history = useHistory();
  const handleParsedData = (data) => {
    const arr = [];
    Object.entries(data).forEach((i) => {
      arr.push({
        ...i[1],
        id: i[0],
      });
    });
    return arr;
  };

  const memoedVideoList = React.useMemo(
    () => handleParsedData(videoListData),
    [videoListData]
  );

  const handleOpenVideoPage = (id) => history.push(`/live-stream/${id}`);

  if (loading) {
    return (
      // <VideoListWrapper>
      <Spinner isRePosition />
      // </VideoListWrapper>
    );
  }

  const handleOpenModal = (id) => {
    setState((state) => ({
      ...state,
      isModalOpen: !state.isModalOpen,
      infoId: id,
    }));
  };

  const handleClose = () => {
    setState((state) => ({ ...state, isModalOpen: false, infoId: "" }));
  };

  const handleChange = (val) => {
    setState((state) => ({ ...state, value: val }));
  };

  return (
    <VideoListWrapper>
      <Modal open={state.isModalOpen} onClose={handleClose}>
        <InfoContainer>
          <Tabs value={state.value} onChange={handleChange}>
            <Tab label="訂閱人數" />
            {/* <Tab label="Item Two" /> */}
          </Tabs>
          <VideoListItem isheader={true}>
            <VideoListText isheader={true} width={30}>
              姓名
            </VideoListText>
            <VideoListText isheader={true} width={33}>
              參與人數
            </VideoListText>
            <VideoListText isheader={true} width={33}>
              付款狀態
            </VideoListText>
          </VideoListItem>
          <VideoContentContainer>
            {state.infoId &&
              memoedVideoList
                .filter((event) => event.id === state.infoId)[0]
                .subscription.map((event) => {
                  return (
                    <VideoListItem key={event.name}>
                      <VideoListText width={33}>{event.name}</VideoListText>
                      <VideoListText width={33}>
                        {event.numOfParticipant}
                      </VideoListText>
                      <VideoListText width={33}>
                        {event.isPaid ? "已付款" : "未付款"}
                      </VideoListText>
                    </VideoListItem>
                  );
                })}
          </VideoContentContainer>
        </InfoContainer>
      </Modal>
      <VideoLists>
        <VideoListItem isheader={true}>
          <VideoListText isheader={true} width={30}>
            影片名稱
          </VideoListText>
          <VideoListText isheader={true} width={50}>
            活動時間
          </VideoListText>
          <VideoListText isheader={true} width={10}>
            開啟影片
          </VideoListText>
          <VideoListText isheader={true} width={10}>
            詳細資訊
          </VideoListText>
        </VideoListItem>
        <VideoContentContainer>
          {memoedVideoList.map((row) => {
            const startDate = new Date(+row.startDate);
            const endDate = new Date(+row.endDate);

            const handleDisplayDate = (date) => {
              return `${date.getFullYear()}/${
                date.getMonth() + 1
              }/${date.getDate()}`;
            };

            return (
              <VideoListItem key={row.id}>
                <VideoListText width={30}>{row.eventName}</VideoListText>
                <VideoListText width={50}>{`${handleDisplayDate(
                  startDate
                )} ~ ${handleDisplayDate(endDate)}`}</VideoListText>
                {row.eventLink ? (
                  <VideoListIcon
                    onClick={() => handleOpenVideoPage(row.id)}
                    width={10}
                  >
                    <LinkIcon />
                  </VideoListIcon>
                ) : (
                  <VideoListText width={10}>實體活動</VideoListText>
                )}

                <VideoListIcon
                  onClick={() => handleOpenModal(row.id)}
                  width={10}
                >
                  <Info />
                </VideoListIcon>
              </VideoListItem>
            );
          })}
        </VideoContentContainer>
      </VideoLists>
    </VideoListWrapper>
  );
};

const VideoListWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  max-height: 80vh;
  overflow-y: scroll !important;
  transform: translateY(100px);
`;
const VideoContentContainer = styled.div`
  max-height: 400px;
  overflow-y: scroll;
`;
const VideoLists = styled(List)`
  width: 100%;
`;
const VideoListItem = styled(ListItem)`
  width: 100%;
  border-bottom: ${(p) => (p.isheader ? "1px solid #666666" : "")};
`;
const VideoListText = styled(ListItemText)`
  width: ${(p) => `${p.width}%`};
  > span {
    color: #666666;
    font-weight: ${(p) => (p.isheader ? "700" : "400")};
    font-size: ${(p) => (p.isheader ? "16px" : "14px")};
  }
`;
const VideoListIcon = styled(ListItemIcon)`
  width: ${(p) => `${p.width}%`};
  .MuiSvgIcon-root {
    cursor: pointer;
    color: #666666;
  }
`;

const InfoContainer = styled.div`
  width: 60%;
  margin: 150px 20%;
  background-color: #fff;
`;

export default VideoList;
