import React from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Modal from "@material-ui/core/Modal";
import LinkIcon from "@material-ui/icons/Link";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Info from "@material-ui/icons/Info";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Delete from "@material-ui/icons/Delete";
import Swal from "sweetalert2";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../util/firebase";

import {
  handleFetchUserDetail,
  handleChangeEventIsPass,
  handleSendEmail,
} from "../../redux/events";

import Spinner from "../Spinner/Spinner";

const VideoList = ({
  loading,
  videoListData = {},
  handleGetData,
  handleDelEvent,
}) => {
  const [state, setState] = React.useState({
    isModalOpen: false,
    modalDisplayControl: 0,
    infoId: "",
    selected_user_id: "",
    is_free: false,
    memoedVideoList: [],
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const handleParsedData = (data) => {
    const arr = [];
    if (data) {
      Object.entries(data)
        .filter((i) => {
          return i[1].isDel === false;
        })
        .forEach((i) => {
          arr.push({
            ...i[1],
            id: i[0],
          });
        });
    }
    return arr;
  };

  React.useEffect(() => {
    const data = handleParsedData(videoListData);
    setState((state) => ({ ...state, memoedVideoList: data }));
  }, [videoListData]);

  const handleOpenVideoPage = (id) => history.push(`/live-stream/${id}`);

  if (loading) {
    return (
      // <VideoListWrapper>
      <Spinner isRePosition />
      // </VideoListWrapper>
    );
  }

  const handleOpenModal = (id, price) => {
    setState((state) => ({
      ...state,
      isModalOpen: !state.isModalOpen,
      infoId: id,
      is_free: price > 0 ? false : true,
    }));
  };

  const handleClose = () => {
    setState((state) => ({ ...state, isModalOpen: false, infoId: "" }));
  };

  const handleChange = (val) => {
    setState((state) => ({ ...state, value: val }));
  };

  const handleModalDisplay = (num) => {
    setState((state) => ({ ...state, modalDisplayControl: num }));
  };

  const handleFetchUserInfo = async (id, event_id, sub_id) => {
    const params = {
      id,
      event_id,
      sub_id,
    };

    await setState((state) => ({
      ...state,
      selected_user_id: id,
      sub_id: sub_id,
    }));
    await dispatch(handleFetchUserDetail(params));
    handleModalDisplay(1);
  };

  const handleCloseModal = () => {
    setState((state) => ({
      ...state,
      modalDisplayControl: 0,
      isModalOpen: false,
    }));
  };

  const handleDisplayDateAndTime = (date) => {
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ":" + minutes.substr(-2);

    return `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${formattedTime}  `;
  };

  return (
    <VideoListWrapper>
      <Modal open={state.isModalOpen} onClose={handleClose}>
        <InfoContainer>
          {state.modalDisplayControl === 0 && state.infoId && (
            <BriefInfo
              dataList={state.memoedVideoList}
              infoId={state.infoId}
              handleFetchUserInfo={handleFetchUserInfo}
            />
          )}
          {state.modalDisplayControl === 1 && (
            <InfoDetail
              user_id={state.selected_user_id}
              is_free={state.is_free}
              handleModalDisplay={handleModalDisplay}
              handleCloseModal={handleCloseModal}
              handleGetData={handleGetData}
              sub_id={state.sub_id}
            />
          )}
        </InfoContainer>
      </Modal>
      <VideoLists>
        <VideoListItem isheader={true}>
          <VideoListText
            isheader={true}
            width={window.innerWidth > 750 ? 30 : 35}
          >
            活動名稱
          </VideoListText>
          <VideoListText isheader={true} width={40}>
            活動時間
          </VideoListText>
          <VideoListText isheader={true} width={10}>
            影片
          </VideoListText>
          {window.innerWidth > 750 && (
            <React.Fragment>
              <VideoListText isheader={true} width={10}>
                資訊
              </VideoListText>
              <VideoListText isheader={true} width={10}>
                刪除
              </VideoListText>
            </React.Fragment>
          )}
        </VideoListItem>
        <VideoContentContainer>
          {state.memoedVideoList
            .sort((a, b) => a.startDate - b.startDate)
            .map((row) => {
              const startDate = new Date(+row.startDate);
              const endDate = new Date(+row.endDate);

              const handleDisplayDate = (date) => {
                return `${date.getFullYear()}/${
                  date.getMonth() + 1
                }/${date.getDate()}`;
              };

              return (
                <VideoListItem
                  key={row.id}
                  onClick={
                    window.innerWidth > 750
                      ? () => {}
                      : () => handleOpenModal(row.id, row.price)
                  }
                >
                  <VideoListText width={window.innerWidth > 750 ? 30 : 40}>
                    {row.eventName}
                  </VideoListText>
                  <VideoListText width={40}>{`${handleDisplayDateAndTime(
                    startDate
                  )} ~ ${handleDisplayDateAndTime(endDate)}`}</VideoListText>
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
                  {window.innerWidth > 750 && (
                    <React.Fragment>
                      <VideoListIcon
                        onClick={() => handleOpenModal(row.id, row.price)}
                        width={10}
                      >
                        <Info />
                      </VideoListIcon>
                      <VideoListIcon
                        onClick={() => handleDelEvent(row.eventName, row.id)}
                        width={10}
                      >
                        <Delete />
                      </VideoListIcon>
                    </React.Fragment>
                  )}
                </VideoListItem>
              );
            })}
        </VideoContentContainer>
      </VideoLists>
    </VideoListWrapper>
  );
};

const BriefInfo = ({ dataList, infoId, handleFetchUserInfo }) => {
  const [state, setState] = React.useState({
    headers: [
      { label: "留言人", key: "account" },
      { label: "留言內容", key: "message" },
      { label: "時間", key: "ts" },
    ],
    overview_headers: [
      { label: "姓名", key: "name" },
      { label: "E-mail", key: "email" },
      { label: "是否通過審核", key: "is_paid" },
      { label: "付款狀態", key: "is_passed" },
    ],
    content: [],
    data_list: [],
  });

  const handleGetMessageData = (eventId) => {
    const msgRef = collection(db, eventId);
    const q = query(msgRef, orderBy("ts"), limit(200));
    onSnapshot(q, (doc) => {
      const updateMessageList = [];

      doc.forEach((msg) => {
        updateMessageList.push({
          account: msg.data().account || "",
          message: msg.data().message || "",
          ts: msg.data().ts.toString() || "",
        });
      });

      setState((state) => ({ ...state, content: updateMessageList }));
    });
  };

  React.useEffect(() => {
    handleGetMessageData(infoId);
  }, [infoId]);

  React.useEffect(() => {
    const update_data = [];
    dataList
      .filter((event) => event.id === infoId)[0]
      .subscription.slice(1)
      .forEach((e) => {
        if (e) {
          update_data.push({
            name: e.name,
            email: e.email,
            is_passed: e.isPass ? "通過審核" : "未通過審核",
            is_paid: e.isPaid ? "已付款" : "點我付款",
          });
        }
      });
    setState((state) => ({ ...state, data_list: update_data }));
  }, [dataList, infoId]);

  console.log(dataList);

  return (
    <React.Fragment>
      <ButtonContainer>
        <Buttons>
          <CSVLink
            data={state.data_list}
            headers={state.overview_headers}
            filename={`${infoId}_報名資料.csv`}
          >
            下載報名資料
          </CSVLink>
        </Buttons>
        <Buttons>
          <CSVLink
            data={state.content}
            headers={state.headers}
            filename={`${infoId}_聊天記錄.csv`}
          >
            下載聊天記錄
          </CSVLink>
        </Buttons>
      </ButtonContainer>
      <VideoListItem isheader={true}>
        <VideoListText isheader={true} width={30}>
          姓名
        </VideoListText>
        <VideoListText isheader={true} width={33}>
          參與人數
        </VideoListText>
        <VideoListText isheader={true} width={33}>
          是否通過審核
        </VideoListText>
        <VideoListText isheader={true} width={33}>
          付款狀態
        </VideoListText>
      </VideoListItem>
      <VideoContentContainer>
        {dataList
          .filter((event) => event.id === infoId && event !== null)[0]
          .subscription.slice(1)
          .map((event) => {
            let status;
            if (!event.isTouched) {
              status = "等待審核";
            } else {
              if (event.isPass) {
                status = "通過";
              } else {
                status = "未通過";
              }
            }

            return (
              <VideoListItem key={event.name}>
                <VideoListText
                  cursor
                  width={33}
                  onClick={() =>
                    handleFetchUserInfo(
                      event.userId,
                      event.eventId,
                      event.subId
                    )
                  }
                >
                  {event.name} (
                  {event.subId?.substring(
                    event.subId.length - 5,
                    event.subId.length
                  )}
                  )
                </VideoListText>
                <VideoListText width={33}>
                  {event.numOfParticipant}
                </VideoListText>
                <VideoListText width={33}>{status}</VideoListText>
                <VideoListText width={33}>
                  {event.isPaid ? "已付款" : "未付款"}
                </VideoListText>
              </VideoListItem>
            );
          })}
      </VideoContentContainer>
    </React.Fragment>
  );
};

const InfoDetail = ({
  user_id,
  handleModalDisplay,
  is_free,
  handleCloseModal,
  handleGetData,
  sub_id,
}) => {
  const dispatch = useDispatch();
  const { userDetail, userDetailLoading } = useSelector(
    (state) => state.events
  );

  console.log(userDetail);

  const [state, setState] = React.useState({
    isPass: false,
  });

  let source;
  if (userDetail.source === "facebook") {
    source = "臉書";
  } else if (userDetail.source === "instagram") {
    source = "Instagram";
  } else {
    source = userDetail.source;
  }

  let status;
  if (!userDetail.isTouched) {
    status = "等待審核";
  } else {
    if (userDetail.isPass) {
      status = "通過審核";
    } else {
      status = "未通過審核";
    }
  }

  const date = new Date(userDetail.registeredTS);

  React.useEffect(() => {
    setState((state) => ({ ...state, isPass: userDetail.isPass }));
  }, [userDetail]);

  const handleToggleIsPass = () => {
    setState((state) => ({ ...state, isPass: !state.isPass }));
  };

  const handleChangePass = (pass) => {
    const params = {
      user_id: user_id,
      event_id: userDetail.eventId,
      is_pass: pass,
      sub_id: sub_id,
    };
    dispatch(handleChangeEventIsPass(params));
    // handleCloseModal();
  };

  const handleDisplayDateAndTime = (date) => {
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ":" + minutes.substr(-2);

    return `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${formattedTime}  `;
  };

  const handleNotifyUser = (pass, sub_id) => {
    const { name } = userDetail;

    Swal.fire({
      html: `<div style="display:flex; justify-content: flex-start; text-align: center">
          <p>即將寄信給 ${name}，${
        pass ? "確認審核通過嗎？" : "確認審核未通過嗎？"
      }</p>
          </div>`,
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "取消",
    }).then((result) => {
      const { value } = result;
      if (value) {
        const { email, name, eventId } = userDetail;
        let type;
        if (is_free) {
          if (pass) {
            type = 6;
          } else {
            type = 5;
          }
        } else {
          if (pass) {
            type = 3;
          } else {
            type = 4;
          }
        }
        handleChangePass(pass, sub_id);
        setTimeout(() => {
          handleGetData();
          handleModalDisplay(0);
        }, 1000);
        dispatch(
          handleSendEmail({
            email_type: type.toString(),
            to_email: email,
            user_name: name,
            event_id: eventId,
          })
        );
        // handleCloseModal();
      }
    });
  };

  return (
    <InfoDetailContainer>
      <InfoDetailHeadContainer>
        <InfoDetailHeadIconContainer>
          <InfoDetailHeadIcon
            onClick={() => {
              handleModalDisplay(0);
            }}
          />
        </InfoDetailHeadIconContainer>
      </InfoDetailHeadContainer>
      <InfoDetailItemContainer>
        <InfoDetailItemInnerContainer width={100}>
          <InfoDetailItemName>
            <p>
              {userDetail.name} <span> {status}</span>
            </p>
          </InfoDetailItemName>
          <InfoDetailItemValue>
            <p>{userDetail.email}</p>
          </InfoDetailItemValue>
        </InfoDetailItemInnerContainer>
      </InfoDetailItemContainer>
      <InfoDetailItemContainer>
        <InfoDetailItemInnerContainer>
          <InfoDetailItemKey>
            <p>報名時間</p>
          </InfoDetailItemKey>
          <InfoDetailItemValue>
            <p>
              {date.getFullYear()} / {date.getMonth() + 1} / {date.getDate()}{" "}
            </p>
          </InfoDetailItemValue>
        </InfoDetailItemInnerContainer>
        <InfoDetailItemInnerContainer>
          <InfoDetailItemKey>
            <p>聯絡電話</p>
          </InfoDetailItemKey>
          <InfoDetailItemValue>
            <p>{userDetail.tel}</p>
          </InfoDetailItemValue>
        </InfoDetailItemInnerContainer>
      </InfoDetailItemContainer>
      <InfoDetailItemContainer>
        <InfoDetailItemInnerContainer>
          <InfoDetailItemKey>
            <p>來源</p>
          </InfoDetailItemKey>
          <InfoDetailItemValue>
            <p>{source}</p>
          </InfoDetailItemValue>
        </InfoDetailItemInnerContainer>
        <InfoDetailItemInnerContainer>
          <InfoDetailItemKey>
            <p>付款狀態</p>
          </InfoDetailItemKey>
          <InfoDetailItemValue>
            <p>{userDetail.isPaid ? "已付款" : "未付款"}</p>
          </InfoDetailItemValue>
        </InfoDetailItemInnerContainer>
      </InfoDetailItemContainer>
      {/* <InfoDetailItemContainer>
        <SwitchContainer>
          <SwitchContainerText>是否通過審核</SwitchContainerText>
          <Switch checked={state.isPass} onClick={handleToggleIsPass} />
        </SwitchContainer>
      </InfoDetailItemContainer> */}
      <InfoDetailItemContainer isBack>
        <ButtonContainer>
          {/* <Buttons onClick={handleNotifyUser}>寄信通知報名人</Buttons> */}
          <Buttons onClick={() => handleNotifyUser(true)}>確認審核通過</Buttons>
          <Buttons onClick={() => handleNotifyUser(false)}>
            確認審核未通過
          </Buttons>
        </ButtonContainer>
      </InfoDetailItemContainer>
    </InfoDetailContainer>
  );
};

const VideoListWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32vh;
  padding-top: 60px;
  overflow-y: scroll !important;
  transform: translateY(80px);
`;

const VideoContentContainer = styled.div`
  max-height: 40vh;
  overflow-y: scroll;

  @media (max-width: 750px) {
    max-height: 25vh;
  }
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
    cursor: ${(p) => p.cursor && "pointer"};
    transition: 0.2s;

    &:hover {
      transition: 0.2s;
      color: ${(p) => (p.cursor ? "#2b8397" : "#666666")};
    }
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

const InfoDetailContainer = styled.div`
  width: 100%;
`;

const InfoDetailHeadContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const InfoDetailHeadIconContainer = styled.div`
  padding: 20px 10% 10px 10%;
  border-bottom: 0.5px solid #ececec;
  width: 100%;
  cursor: pointer;
`;

const InfoDetailHeadIcon = styled(ArrowBackIos)``;

const InfoDetailItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p) => p.isBack & "flex-end"};
`;

const InfoDetailItemInnerContainer = styled.div`
  width: ${(p) => (p.width ? "100%" : "30%")};
  padding: 10px 10%;
  display: flex;
  align-items: flex-end;
  justify-content: ${(p) => (p.isName ? "flex-start" : "space-between")};
`;

const InfoDetailItemKey = styled.div`
  display: flex;
  align-items: flex-end;
  > p {
    font-size: 12px;
    font-weight: 300;
  }
`;

const InfoDetailItemValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > p {
    font-size: 20px;
    font-weight: 300;
  }
`;

const InfoDetailItemName = styled.div`
  > p {
    font-size: 35px;
    font-weight: 600;

    > span {
      font-size: 10px;
      font-weight: 400;
    }
  }
`;

const SwitchContainer = styled.div`
  width: 30%;
  padding: 10px 10%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ButtonContainer = styled.div`
  width: 80%;
  padding: 10px 10% 30px 10%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SwitchContainerText = styled.p`
  font-size: 20px;
  font-weight: 300;
`;

const Buttons = styled(Button)`
  background-color: #2b8397 !important;
  color: #fff !important;
  padding: 10px !important;
  margin-left: 15px !important;
  > a {
    color: #fff !important;
    text-decoration: none;
  }
`;

export default VideoList;
