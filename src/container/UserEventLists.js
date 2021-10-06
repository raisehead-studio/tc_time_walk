import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import MoreVert from "@material-ui/icons/MoreVert";
import Swal from "sweetalert2";

import { handleFetchUserData } from "../redux/events";
import firebase from "../util/firebase";
import { handleECPayment } from "../util/api";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const UserEventLists = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { uid } = props.match.params;
  const { userEvents, userEventsLoading } = useSelector(
    (state) => state.events
  );
  const { isAdmin } = useSelector((state) => state.user);
  const [state, setState] = React.useState({
    open: false,
    paymentPage: null,
  });

  React.useEffect(() => {
    if (isAdmin) history.push("/");
  }, [isAdmin]);

  React.useEffect(() => {
    if (uid) dispatch(handleFetchUserData(uid));
  }, [uid]);

  const handlePurchase = async (id, isExpired) => {
    const eventData = userEvents.filter((event) => event.id === id)[0];

    const data = {
      trade_name: eventData.eventName,
      trade_phone: eventData.tel,
      county: "",
      district: "",
      zipcode: "",
      event_id: eventData.eventId,
      order_id: eventData.id,
      amount_price: eventData.numOfParticipant * eventData.price,
      user_id: uid,
    };

    handleECPayment(data).then((res) => {
      setState((state) => ({ ...state, open: true, paymentPage: res.data }));
      document.open();
      document.write(res.data);
      document.close();
    });
  };

  const handleDisplayDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleOpenDetail = (id) => {
    let detail = userEvents.filter((event) => event.id === id)[0].summary;
    Swal.fire({
      html: `<div style="display:flex; justify-content: flex-start; text-align: left">
          <p>${detail}</p>
        </div>`,
    });
  };

  const handleOpenVideoPage = (id, isExpired, eventLink) => {
    // if (eventLink) {
    //   if (!isExpired) history.push(`/live-stream/${id}`);
    // }
    history.push(`/live-stream/${id}`);
  };

  return (
    <UserEventListsWrapper>
      <UserEventListsCard>
        <UserEventList>
          <UserEventListItem isheader={true}>
            <UserEventListText isheader={true} width={20}>
              活動名稱
            </UserEventListText>
            <UserEventListText isheader={true} width={30}>
              時間
            </UserEventListText>
            <UserEventListText isheader={true} width={30}>
              影片連結
            </UserEventListText>
            <UserEventListText isheader={true} width={15}>
              付款
            </UserEventListText>
            <UserEventListText isheader={true} width={5}>
              內容
            </UserEventListText>
          </UserEventListItem>
          <UserEventContainer>
            {userEvents.map((event) => {
              let isExpired = false;
              const now = new Date().getTime();
              if (event.endDate < now || now < event.startDate) {
                isExpired = true;
              }
              return (
                <UserEventListItem isExpired={isExpired}>
                  <UserEventListText width={20}>
                    {event.eventName}
                  </UserEventListText>
                  <UserEventListText width={30}>
                    {handleDisplayDate(new Date(event.startDate))} ~{" "}
                    {handleDisplayDate(new Date(event.endDate))}
                  </UserEventListText>
                  <UserEventListText
                    width={30}
                    notAllow={!event.isPaid || isExpired}
                    isHover
                    onClick={
                      handleOpenVideoPage(
                        event.eventId,
                        isExpired,
                        event.eventLink
                      )
                      // !event.isPaid
                      //   ? () => {}
                      //   : () =>
                      //       handleOpenVideoPage(
                      //         event.eventId,
                      //         isExpired,
                      //         event.eventLink
                      //       )
                    }
                  >
                    {!event.isPaid
                      ? "於付款後開放連結"
                      : isExpired
                      ? "活動已結束"
                      : event.eventLink
                      ? event.eventLink
                      : "實體活動"}
                  </UserEventListText>
                  <UserEventListIcon width={15}>
                    {!event.isPaid ? (
                      <React.Fragment>
                        <MonetizationOn
                          onClick={() => handlePurchase(event.id)}
                        />
                        <p>未付款</p>
                      </React.Fragment>
                    ) : (
                      <IsPardText>已付款</IsPardText>
                    )}
                  </UserEventListIcon>
                  <UserEventListIcon
                    width={5}
                    onClick={() => handleOpenDetail(event.id)}
                  >
                    <MoreVert />
                  </UserEventListIcon>
                </UserEventListItem>
              );
            })}
          </UserEventContainer>
        </UserEventList>
      </UserEventListsCard>
    </UserEventListsWrapper>
  );
};

const PaymentContainer = styled.div`
  margin: 40px 10%;
  width: 80%;
  background: #fff;
  min-height: 40px;
`;

const UserEventListsWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: auto;
  max-height: 80vh;
  overflow-y: scroll !important;
  transform: translateY(80px);
`;

const UserEventListsCard = styled(Card)`
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UserEventList = styled(List)`
  width: 100%;
`;

const UserEventContainer = styled.div`
  max-height: 70vh;
  overflow-y: scroll;
`;

const UserEventListItem = styled(ListItem)`
  width: 100%;
  border-bottom: ${(p) => (p.isheader ? "1px solid #666666" : "")};
  opacity: ${(p) => (p.isExpired ? "0.4" : "1")};
`;
const UserEventListText = styled(ListItemText)`
  width: ${(p) => `${p.width}%`};
  > span {
    border-radius: ${(p) => (!p.notAllow ? "0px" : "10px")};
    width: ${(p) => (!p.notAllow ? "100%" : "50%")};
    color: ${(p) => (!p.notAllow ? "#666666" : "#fff")};
    padding: ${(p) => (!p.notAllow ? "0px" : "5px 10px")};
    background-color: ${(p) => (!p.notAllow ? "#fff" : "#666666")};
    font-weight: ${(p) => (p.isheader ? "700" : "400")};
    font-size: ${(p) => (p.isheader ? "16px" : "14px")};
    text-align: ${(p) => (!p.notAllow ? "left" : "center")};
    cursor: ${(p) => (!p.notAllow && p.isHover ? "pointer" : "")};
    transition: 0.2s;

    &:hover {
      color: ${(p) => (!p.notAllow && p.isHover ? "#f8e180" : "#none")};
      transition: 0.2s;
    }
  }
`;
const UserEventListIcon = styled(ListItemIcon)`
  width: ${(p) => `${p.width}%`};
  display: flex;
  align-items: center;

  > p {
    opacity: 0.6;
    padding-left: 5px;
    font-size: 14px;
    cursor: pointer;
  }
  .MuiSvgIcon-root {
    cursor: pointer;
    color: #666666;
  }
`;

const IsPardText = styled.p`
  color: #32d608;
  font-weight: 600;
  font-size: 14px;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(UserEventLists);
