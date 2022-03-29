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

import Spinner from "../components/Spinner/Spinner";
import { handleFetchUserData } from "../redux/events";
import firebase from "../util/firebase";
import { handleECPayment } from "../util/api";
import UserEventCard from "../components/UserEventCard";

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
    is_paying: false,
  });

  React.useEffect(() => {
    if (isAdmin) history.push("/");
  }, [isAdmin]);

  React.useEffect(() => {
    if (uid) dispatch(handleFetchUserData(uid));
  }, [uid]);

  const handlePurchase = async (id, isExpired) => {
    const eventData = userEvents.filter((event) => event.id === id)[0];

    let price;
    if (+eventData.numOfParticipant >= +eventData.discount_amount) {
      price =
        +eventData.numOfParticipant *
        +eventData.price *
        (+eventData.discount_rate * 0.1);
    } else {
      price = +eventData.numOfParticipant * +eventData.price;
    }
    const data = {
      trade_name: eventData.eventName,
      trade_phone: eventData.tel,
      county: "",
      district: "",
      zipcode: "",
      event_id: eventData.eventId,
      order_id: eventData.id,
      amount_price: price,
      user_id: uid,
    };

    handleECPayment(data).then((res) => {
      setState((state) => ({
        ...state,
        open: true,
        paymentPage: res.data,
        is_paying: true,
      }));
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
    if (eventLink) {
      if (!isExpired) history.push(`/live-stream/${id}`);
    }
  };

  if (true) {
    return (
      <MobileContainer>
        <Loading is_show={state.is_paying} />
        {userEvents.length === 0 ? (
          <UserEventListItem>
            <NoDataText width={100}>
              您尚未報名任何活動。（No Tour Registered Yet）
            </NoDataText>
          </UserEventListItem>
        ) : (
          userEvents.map((event) => <UserEventCard event={event} uid={uid} />)
        )}
      </MobileContainer>
    );
  }

  return (
    <UserEventListsWrapper>
      <UserEventListsCard>
        <UserEventList>
          <UserEventListItem isheader={true}>
            <UserEventListText isheader={true} width={20}>
              活動名稱
            </UserEventListText>
            <UserEventListText isheader={true} width={20}>
              時間 (Tour date)
            </UserEventListText>
            <UserEventListText isheader={true} width={15}>
              參加人數 (Number of Participants)
            </UserEventListText>
            <UserEventListText isheader={true} width={15}>
              影片連結 (Video Link)
            </UserEventListText>
            <UserEventListText isheader={true} width={5}>
              總價 (Amount)
            </UserEventListText>
            <UserEventListText isheader={true} width={15}>
              付款 (Is Paid)
            </UserEventListText>
            <UserEventListText isheader={true} width={5}>
              內容 (Tour content)
            </UserEventListText>
          </UserEventListItem>
          <UserEventContainer>
            {userEvents.length === 0 ? (
              <UserEventListItem>
                <NoDataText width={100}>
                  您尚未報名任何活動。（No Tour Registered Yet）
                </NoDataText>
              </UserEventListItem>
            ) : (
              userEvents.map((event) => {
                let isExpired = false;
                let payment_status;
                const now = new Date().getTime();
                if (event.endDate < now || now < event.startDate) {
                  isExpired = true;
                }

                if (event.isPass) {
                  if (event.isPaid || event.price === 0) {
                    payment_status = <IsPardText>報名成功</IsPardText>;
                  } else {
                    payment_status = (
                      <React.Fragment>
                        <MonetizationOn
                          onClick={() => handlePurchase(event.id)}
                        />
                        <p>點我付款</p>
                      </React.Fragment>
                    );
                  }
                } else {
                  payment_status = (
                    <React.Fragment>
                      <p>未通過審核</p>
                    </React.Fragment>
                  );
                }

                return (
                  <UserEventListItem isExpired={isExpired}>
                    <UserEventListText width={20}>
                      {event.eventName}
                    </UserEventListText>
                    <UserEventListText width={20}>
                      {handleDisplayDate(new Date(event.startDate))} ~{" "}
                      {handleDisplayDate(new Date(event.endDate))}
                    </UserEventListText>
                    <UserEventListText width={10}>
                      {event.numOfParticipant}
                    </UserEventListText>
                    <UserEventListText
                      width={15}
                      notAllow={!event.isPaid || isExpired}
                      isHover
                      onClick={
                        !event.isPaid
                          ? () => {}
                          : () =>
                              handleOpenVideoPage(
                                event.eventId,
                                isExpired,
                                event.eventLink
                              )
                      }
                    >
                      {!event.isPaid && event.price !== 0
                        ? "於付款後開放連結"
                        : isExpired
                        ? "非活動期間"
                        : event.eventLink
                        ? "線上活動連結"
                        : "實體活動"}
                    </UserEventListText>
                    <UserEventListText width={5}>
                      {event.price}
                    </UserEventListText>
                    <UserEventListIcon width={15}>
                      {payment_status}
                    </UserEventListIcon>
                    <UserEventListIcon
                      width={5}
                      onClick={() => handleOpenDetail(event.id)}
                    >
                      <MoreVert />
                    </UserEventListIcon>
                  </UserEventListItem>
                );
              })
            )}
          </UserEventContainer>
        </UserEventList>
      </UserEventListsCard>
    </UserEventListsWrapper>
  );
};

const Loading = ({ is_show }) => {
  return (
    <LoadingWrapper is_show={is_show}>
      <Spinner></Spinner>
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  position: absolute;
  width: 80%;
  margin: 0px 10%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${(p) => (p.is_show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const MobileContainer = styled.div`
  width: 100%;
  height: 80vh;
  overflow-y: scroll;
  transform: translateY(65px);
  position: relative;
`;

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
  transform: translateY(80px);
  @media (max-height: 500px) {
    height: 60vh;
  }
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
  @media (max-height: 500px) {
    max-height: 50vh;
  }
`;

const UserEventListItem = styled(ListItem)`
  width: 100%;
  border-bottom: ${(p) => (p.isheader ? "1px solid #666666" : "")};
  opacity: ${(p) => (p.isExpired ? "0.4" : "1")};
  height: 40px !important;
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
    font-size: ${(p) => (p.isheader ? "13px" : "12px")};
    text-align: ${(p) => (p.notAllow ? "left" : "center")};
    cursor: ${(p) => (!p.notAllow && p.isHover ? "pointer" : "")};
    transition: 0.2s;

    &:hover {
      color: ${(p) => (!p.notAllow && p.isHover ? "#f8e180" : "#none")};
      transition: 0.2s;
    }
  }
`;

const NoDataText = styled(UserEventListText)`
  /* width: calc(100% - 40px); */
  > span {
    text-align: center;
    padding: 20px 0px;
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
