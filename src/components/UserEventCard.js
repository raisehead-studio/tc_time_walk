import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Card from "@material-ui/core/Card";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import { handleECPayment } from "../util/api";
import Swal from "sweetalert2";

// import Card from "@material-ui/core/Card";

const UserEventCard = ({ event, uid }) => {
  const { userEvents, userEventsLoading } = useSelector(
    (state) => state.events
  );
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
          <MonetizationOn onClick={() => handlePurchase(event.id)} />
          <p>未付款</p>
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

  const handleDisplayDate = (date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleDisplayDateAndTime = (date) => {
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ":" + minutes.substr(-2);

    return `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${formattedTime}  `;
  };

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
      document.open();
      document.write(res.data);
      document.close();
    });
  };

  const handleOpenDetail = (id) => {
    let detail = userEvents.filter((event) => event.id === id)[0].summary;
    Swal.fire({
      html: `<div style="display:flex; justify-content: flex-start; text-align: left">
          <p>${detail}</p>
        </div>`,
    });
  };

  console.log(event.registeredTS);

  return (
    <CustomCard>
      <CustomCardRow head>
        <CustomCardRowTitle>活動名稱(Tour Name) :</CustomCardRowTitle>
        <CustomCardRowText>{event.eventName}</CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow>
        <CustomCardRowTitle>時間(Tour Date) :</CustomCardRowTitle>
        <CustomCardRowText>
          {handleDisplayDateAndTime(new Date(event.startDate))} ~{" "}
          {handleDisplayDateAndTime(new Date(event.endDate))}
        </CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow>
        <CustomCardRowTitle>參加人數(Attendance)</CustomCardRowTitle>
        <CustomCardRowText>{event.numOfParticipant}</CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow>
        <CustomCardRowTitle>報名時間(RegDate)</CustomCardRowTitle>
        <CustomCardRowText>
          {handleDisplayDate(new Date(event.registeredTS))}
        </CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow>
        <CustomCardRowTitle>影片連結(Video Link) :</CustomCardRowTitle>
        <CustomCardRowText>
          {!event.isPaid && event.price !== 0
            ? "於付款後開放連結"
            : isExpired
            ? "非活動期間"
            : event.eventLink
            ? "線上活動連結"
            : "實體活動"}
        </CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow>
        <CustomCardRowTitle>總價(Total Amount) :</CustomCardRowTitle>
        <CustomCardRowText>
          {event.price === 0 ? "免費活動" : event.price}
        </CustomCardRowText>
      </CustomCardRow>
      <CustomCardRow bottom>
        <CustomCardRowTitle>付款(Payment Status) :</CustomCardRowTitle>
        <CustomCardRowText>{payment_status}</CustomCardRowText>
      </CustomCardRow>
      <CustomCardMoreRow>
        <MoreText onClick={() => handleOpenDetail(event.id)}>活動內容</MoreText>
      </CustomCardMoreRow>
    </CustomCard>
  );
};

const CustomCard = styled(Card)`
  width: 80%;
  margin: 10px 10%;
  padding: 5px;

  @media (max-width: 750px) {
    width: 95%;
    margin: 10px 2.5%;
    padding: 0px;
  }
`;

const CustomCardRow = styled.div`
  width: calc(100% - 30px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 15px;
  border-top: ${(p) => !p.head && "0.5px solid #ececec"};
  border-bottom: ${(p) => !p.bottom && "0.5px solid #ececec"};
`;

const CustomCardMoreRow = styled.div`
  width: calc(100% - 30px);
  display: flex;
  padding: 10px 15px;
  justify-content: flex-end;
  border: none;
`;

const CustomCardRowTitle = styled.p`
  font-weight: 600;
  width: 20%;
  margin-left: 5%;
  @media (max-width: 750px) {
    font-size: 12px;
    width: 40%;
    margin-left: 2.5%;
  }
`;

const CustomCardRowText = styled.p`
  width: 70%;
  margin-right: 5%;
  @media (max-width: 750px) {
    font-size: 12px;
    width: 50%;
  }
`;

const IsPardText = styled.p`
  color: #32d608;
  font-weight: 600;
  font-size: 14px;
`;

const MoreText = styled.p`
  font-weight: 600;
  margin-left: 5%;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  @media (max-width: 750px) {
    font-size: 10px;
    width: 40%;
    margin-left: 2.5%;
  }
`;

export default UserEventCard;
