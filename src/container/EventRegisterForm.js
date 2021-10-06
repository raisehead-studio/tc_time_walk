import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import withFirebaseAuth from "react-with-firebase-auth";
import Card from "@material-ui/core/Card";
import Swal from "sweetalert2";

import {
  SelectForm,
  Inputs,
  CheckboxForm,
  DateInputForm,
  ButtonForm,
} from "../styles/index";
import Spinner from "../components/Spinner/Spinner";
import {
  handleFetchEventData,
  handleFetchEventDetail,
  handleUpdateEvent,
} from "../redux/events";
import firebase from "../util/firebase";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const EventRegisterForm = (props) => {
  const { user } = props;
  const { events, eventDetail, eventLoading, eventUpdatedLoading } =
    useSelector((state) => state.events);
  const dispatch = useDispatch();
  const { eventId } = props.match.params;
  const history = useHistory();
  const [state, setState] = React.useState({
    eventData: [],
    price: 0,
    name: "",
    eventId: "",
    eventTs: "",
    numOfParticipant: 1,
    email: "",
    tel: "",
    language: "",
    sourcePresent: "",
    source: "",
    isParticipated: false,
    suggestion: "",
    isOpenSourceOther: false,
  });

  React.useEffect(() => {
    dispatch(handleFetchEventData());
  }, []);

  React.useEffect(() => {
    if (eventId) {
      dispatch(handleFetchEventDetail(eventId));
      setState((state) => ({ ...state, eventId: eventId }));
    }
  }, [eventId]);

  React.useEffect(() => {
    if (user) {
      const { displayName, email, uid } = user.multiFactor.user;
      setState((state) => ({ ...state, name: displayName, email: email }));
    }
  }, [user]);

  React.useEffect(() => {
    if (Object.entries(events).length > 0) {
      const updateEventData = [];

      Object.entries(events).forEach((event) => {
        updateEventData.push({
          id: event[0],
          name: event[1].eventName + ` (${event[1].price}/人)`,
        });
      });

      setState((state) => ({ ...state, eventData: updateEventData }));
    }
  }, [events]);

  React.useEffect(() => {
    if (state.sourcePresent === "other") {
      setState((state) => ({
        ...state,
        isOpenSourceOther: true,
      }));
    } else {
      setState((state) => ({
        ...state,
        isOpenSourceOther: false,
      }));
    }
  }, [state.sourcePresent]);

  React.useEffect(() => {
    if (Object.entries(eventDetail).length > 0) {
      setState((state) => ({
        ...state,
        eventTs: eventDetail.startDate,
        subscription: eventDetail.subscription,
      }));
    }
  }, [eventDetail]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "eventId") {
      dispatch(handleFetchEventDetail(value));
    }

    if (name === "numOfParticipant" && value < 1) {
      Swal.fire("參加人數不得小於1人。").then((result) => {
        return;
      });
    } else {
      setState((state) => ({
        ...state,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (val) => {
    setState((state) => ({ ...state, isParticipated: val }));
  };

  const handleSubmit = () => {
    Swal.fire({
      html:
        "<div style='display: flex; flex-direction: column; align-items: flex-start; width: 80%; margin: 0px 10%'>" +
        "<div style='width: 100%; display: flex; justify-content: center; ; margin: 0px 0% 10px 0%'><h3 style='font-weight: 700; font-size: 1.5rem'>報名資訊</h3></div>" +
        `<p><strong style='font-weight: 600'>報名人姓名：</strong>${state.name}</p>` +
        `<p><strong style='font-weight: 600'>參加人數：</strong>${state.numOfParticipant}</p>` +
        `<p><strong style='font-weight: 600'>聯絡 email：</strong>${state.email}</p>` +
        `<p><strong style='font-weight: 600'>聯絡電話：</strong>${state.tel}</p>` +
        `<p><strong style='font-weight: 600'>費用：${
          state.numOfParticipant * eventDetail.price
        }</strong></p>` +
        "</div>",
      showCancelButton: true,
      confirmButtonText: "確認報名",
      cancelButtonText: "取消",
    }).then((result) => {
      const { value } = result;
      if (value) {
        const { uid } = user.multiFactor.user;
        const {
          name,
          eventId,
          eventTs,
          numOfParticipant,
          email,
          tel,
          language,
          source,
          sourcePresent,
          isParticipated,
          suggestion,
          subscription,
        } = state;
        const updateSubscription = [];
        if (Array.isArray(subscription)) {
          subscription.forEach((i) => updateSubscription.push(i));
        } else {
          Object.values(subscription).forEach((i) =>
            updateSubscription.push(i)
          );
        }
        updateSubscription.push({
          isPaid: false,
          email: email,
          numOfParticipant: numOfParticipant,
          name: name,
        });
        const data = {
          ...events[eventId],
          isPaid: false,
          name: name,
          eventId: eventId,
          eventTs: eventTs,
          numOfParticipant: numOfParticipant,
          email: email,
          tel: tel,
          language: language,
          source: sourcePresent === "other" ? source : sourcePresent,
          isParticipated: isParticipated,
          suggestion: suggestion,
          subscription: updateSubscription,
          registeredTS: new Date().getTime(),
        };
        dispatch(handleUpdateEvent({ uid: uid, data: data }));
        setTimeout(() => {
          if (!eventUpdatedLoading) {
            history.push(`/event_list/${uid}`);
          }
        }, 2000);
      }
    });
  };

  const handleSelectEvent = (e) => {
    const { value } = e.target;
    history.push(`/event_signup/${value}`);
  };

  if (eventUpdatedLoading) {
    return (
      <EventRegisterFormWrapper>
        <EventRegisterFormLoadingCard>
          <Spinner />
        </EventRegisterFormLoadingCard>
      </EventRegisterFormWrapper>
    );
  } else {
    return (
      <EventRegisterFormWrapper>
        <EventRegisterCard>
          <EventRegisterTextContainer>
            <EventRegisterText>
              報名{eventDetail ? eventDetail.videoName : ""}活動 :
            </EventRegisterText>
          </EventRegisterTextContainer>
          <Inputs
            label="姓名"
            value={state.name}
            onChange={handleChange}
            name="name"
          />
          <SelectForm
            label="預約行程"
            options={state.eventData}
            disabled={!eventDetail}
            value={state.eventId}
            onChange={handleSelectEvent}
            name="eventId"
          />
          <DateInputForm
            label="行程日期"
            value={state.eventTs}
            onChange={handleChange}
            name="eventTs"
          />
          <Inputs
            label="參加人數"
            value={state.numOfParticipant}
            onChange={handleChange}
            name="numOfParticipant"
            type="number"
          />
          <Inputs
            label="電子信箱"
            value={state.email}
            onChange={handleChange}
            name="email"
          />
          <Inputs
            label="聯絡電話"
            value={state.tel}
            onChange={handleChange}
            name="tel"
          />
          <SelectForm
            label="導覽語言中文/英文"
            value={state.language}
            onChange={handleChange}
            name="language"
            options={[
              { name: "英文", id: "english" },
              { name: "中文", id: "chinese" },
            ]}
          />
          <SelectForm
            label="從哪裡得知活動訊息"
            value={state.sourcePresent}
            onChange={handleChange}
            name="sourcePresent"
            options={[
              { name: "臉書", id: "facebook" },
              { name: "IG", id: "instagram" },
              { name: "其他", id: "other" },
            ]}
          />
          {state.isOpenSourceOther && (
            <Inputs
              label="其他"
              value={state.source}
              onChange={handleChange}
              name="source"
            />
          )}
          <CheckboxForm
            label="是否以前參加過TC活動"
            value={state.isParticipated}
            onChange={handleCheckboxChange}
            name="isParticipated"
            options={[
              { name: "曾經參加過", id: "isParticipated", returnVal: true },
              { name: "沒有參加過", id: "isNotParticipated", returnVal: false },
            ]}
          />
          {/* <Inputs
            label="客製化行程提案空白頁面自己填或私訊我們"
            value={state.suggestion}
            onChange={handleChange}
            name="suggestion"
          /> */}
          <ButtonContainer>
            <ButtonForm label="註冊活動" onClick={handleSubmit} />
          </ButtonContainer>
        </EventRegisterCard>
      </EventRegisterFormWrapper>
    );
  }
};

const EventRegisterFormWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
`;

const EventRegisterCard = styled(Card)`
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: translateY(70px);
`;

const EventRegisterFormLoadingCard = styled(EventRegisterCard)`
  height: 400px;
`;

const EventRegisterTextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const EventRegisterText = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 20px 5% 0px 5%;
`;

const ButtonContainer = styled.div`
  margin: 10px 5%;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(EventRegisterForm);
