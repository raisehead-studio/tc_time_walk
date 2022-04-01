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
  handleSendEmail,
} from "../redux/events";
import { handleSubmitEvent, handleUpdateEventSubscription } from "../util/api";
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
    cachedLanguage: "",
    language: "",
    sourcePresent: "",
    source: "",
    isParticipated: false,
    suggestion: "",
    isOpenSourceOther: false,
    active: false,
    discount_amount: 0,
    discount_rate: 0,
  });

  React.useEffect(() => {
    if (
      !state.name ||
      !state.eventId ||
      !state.eventTs ||
      !state.email ||
      !state.tel ||
      (!state.language && !state.cachedLanguage) ||
      (!state.source && !state.sourcePresent) ||
      state.numOfParticipant <= 0
    ) {
      setState((state) => ({ ...state, active: false }));
    } else {
      setState((state) => ({ ...state, active: true }));
    }
  }, [
    state.name,
    state.eventId,
    state.eventTs,
    state.numOfParticipant,
    state.email,
    state.tel,
    state.language,
    state.source,
    state.cachedLanguage,
    state.sourcePresent,
  ]);

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
      setState((state) => ({
        ...state,
        name: displayName,
        email: email,
        uid: uid,
      }));
    }
  }, [user]);

  React.useEffect(() => {
    if (Object.entries(events).length > 0) {
      const updateEventData = [];

      Object.entries(events)
        .sort((a, b) => a[1].startDate - b[1].startDate)
        .filter((i) => {
          return i[1].isDel === false && i[1].endDate > new Date().getTime();
        })
        .forEach((event) => {
          updateEventData.push({
            id: event[0],
            name: `${event[1].eventName} (${event[1].price}/人)`,
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
    let price;
    if (
      state.numOfParticipant >= +eventDetail.discount_amount &&
      +eventDetail.discount_amount !== 0
    ) {
      price = Math.floor(
        state.numOfParticipant *
          eventDetail.price *
          (eventDetail.discount_rate * 0.01)
      );
    } else {
      price = +state.numOfParticipant * eventDetail.price;
    }

    Swal.fire({
      html:
        "<div style='display: flex; flex-direction: column; align-items: flex-start; width: 80%; margin: 0px 10%'>" +
        "<div style='width: 100%; display: flex; justify-content: center; ; margin: 0px 0% 10px 0%'><h3 style='font-weight: 700; font-size: 1.5rem'>報名資訊</h3></div>" +
        `<p><strong style='font-weight: 600'>報名人姓名：</strong>${state.name}</p>` +
        `<p><strong style='font-weight: 600'>參加人數：</strong>${state.numOfParticipant}</p>` +
        `<p><strong style='font-weight: 600'>聯絡 email：</strong>${state.email}</p>` +
        `<p><strong style='font-weight: 600'>聯絡電話：</strong>${state.tel}</p>` +
        `<p><strong style='font-weight: 600'>費用：${price}</strong></p>` +
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
          cachedLanguage,
          source,
          sourcePresent,
          isParticipated,
          suggestion,
          subscription,
        } = state;

        const data = {
          ...events[eventId],
          isPaid: false,
          name: name,
          eventId: eventId,
          eventTs: eventTs,
          numOfParticipant: numOfParticipant,
          email: email,
          tel: tel,
          language: language ? language : cachedLanguage,
          source: sourcePresent === "other" ? source : sourcePresent,
          isParticipated: isParticipated,
          suggestion: suggestion,
          // subscription: updateSubscription,
          registeredTS: new Date().getTime(),
          isPass: false,
          isTouched: false,
          discount_amount: eventDetail.discount_amount,
          discount_rate: eventDetail.discount_rate,
        };

        handleSubmitEvent({ uid: uid, data: data }).then((res) => {
          console.log(res);

          const subId = res.data.name;
          const updateSubscription = [];
          if (Array.isArray(subscription)) {
            subscription.forEach((i) => updateSubscription.push(i));
          } else {
            Object.values(subscription).forEach((i) =>
              updateSubscription.push(i)
            );
          }
          updateSubscription.push({
            subId: subId,
            isPaid: false,
            email: email,
            userId: uid,
            numOfParticipant: numOfParticipant,
            name: name,
            eventId: eventId,
            isPass: false,
            isTouched: false,
          });
          handleUpdateEventSubscription(eventId, updateSubscription).then(
            (res) => {
              dispatch(
                handleSendEmail({
                  //寄給報名人
                  email_type: "1",
                  to_email: email,
                  user_name: name,
                  event_id: eventId,
                  subId: subId,
                })
              );
              dispatch(
                //寄給 TC 團隊
                handleSendEmail({
                  email_type: "2",
                  to_email: "tctimewalk3.0@gmail.com",

                  user_name: name,
                  event_id: eventId,
                  subId: "",
                })
              );
              setTimeout(() => {
                if (!eventUpdatedLoading) {
                  history.push(`/event_list/${uid}`);
                }
              }, 2000);
            }
          );
        });
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
        <EventRegisterMobileTextContainer>
          <Text>想要預約小費/客製化導覽嗎？</Text>
          <Text>（Tips-based / Customized tour）</Text>
          <Text>
            <span
              onClick={() => {
                window.open("https://forms.gle/sWdQsXTEQkMFFDEA7", "_blank");
              }}
            >
              選我就對了!(Click me!)
            </span>
          </Text>
        </EventRegisterMobileTextContainer>
        <EventRegisterCard>
          <EventRegisterTextContainer>
            <EventRegisterText>
              報名{eventDetail ? eventDetail.videoName : ""}活動 (Make
              Reservation):
            </EventRegisterText>
            <TextContainer>
              <Text>
                想要預約小費/客製化導覽嗎？（Tips-based / Customized tour）
              </Text>
              <Text>
                <span
                  onClick={() => {
                    window.open(
                      "https://forms.gle/sWdQsXTEQkMFFDEA7",
                      "_blank"
                    );
                  }}
                >
                  選我就對了!(Click me!)
                </span>
              </Text>
            </TextContainer>
          </EventRegisterTextContainer>
          <Inputs
            label="姓名(Name)"
            value={state.name}
            onChange={handleChange}
            name="name"
          />
          <SelectForm
            label="預約行程(Want To Join?)"
            options={state.eventData}
            disabled={!eventDetail}
            value={state.eventId}
            onChange={handleSelectEvent}
            name="eventId"
          />
          {eventDetail.summary && (
            <EventRegisterFormEventCard>
              <p>{eventDetail.summary}</p>
            </EventRegisterFormEventCard>
          )}

          <DateInputForm
            label="行程日期(Date)"
            value={state.eventTs}
            onChange={handleChange}
            name="eventTs"
          />
          <Inputs
            label="參加人數(How may people?)"
            value={state.numOfParticipant}
            onChange={handleChange}
            name="numOfParticipant"
            type="number"
          />
          <Inputs
            label="電子信箱(Email)"
            value={state.email}
            onChange={handleChange}
            name="email"
          />
          <Inputs
            label="聯絡電話(Phone number or emergency)"
            value={state.tel}
            onChange={handleChange}
            name="tel"
          />
          <SelectForm
            label="導覽語言中文/英文(Language for tour)"
            value={state.cachedLanguage}
            onChange={handleChange}
            name="cachedLanguage"
            options={[
              { name: "英文(English)", id: "english" },
              { name: "中文(Chinese)", id: "chinese" },
              { name: "其他(Others)", id: "other" },
            ]}
          />
          {state.cachedLanguage === "other" && (
            <Inputs
              value={state.language}
              onChange={handleChange}
              name="language"
            />
          )}
          <SelectForm
            label="從哪裡得知活動訊息(Where to know the info)"
            value={state.sourcePresent}
            onChange={handleChange}
            name="sourcePresent"
            options={[
              { name: "臉書(Facebook)", id: "facebook" },
              { name: "instagram", id: "instagram" },
              { name: "其他(Others)", id: "other" },
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
            label="是否以前參加過TC活動(Have you ever joined the activity before)"
            value={state.isParticipated}
            onChange={handleCheckboxChange}
            name="isParticipated"
            options={[
              {
                name: "曾經參加過(Yes)",
                id: "isParticipated",
                returnVal: true,
              },
              {
                name: "沒有參加過(No)",
                id: "isNotParticipated",
                returnVal: false,
              },
            ]}
          />
          {/* <Inputs
            label="客製化行程提案空白頁面自己填或私訊我們"
            value={state.suggestion}
            onChange={handleChange}
            name="suggestion"
          /> */}

          <ButtonContainer>
            <ButtonForm
              active={state.active}
              label="確認報名(Confirm)"
              onClick={state.active ? handleSubmit : () => {}}
            />
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
  width: 100vw;
  padding: 50px 0px;
  overflow-y: hidden;
  transform: translateY(50px);
  background-image: linear-gradient(
    135deg,
    rgba(43, 131, 151, 0.2) 0%,
    rgba(248, 225, 128, 0.2) 100%
  );
  @media (max-width: 460px) {
    padding: 10px 0px 50px 0px;

    /* transform: translateY(70px); */
  }
`;

const EventRegisterCard = styled(Card)`
  width: 80%;
  background-color: #fff;
  display: block;
  /* height: 77vh; */
  margin-top: 0px;
  overflow-y: scroll !important;

  @media (max-width: 460px) {
    width: 90%;
    /* transform: translateY(70px); */
  }
`;

const EventRegisterFormEventCard = styled.div`
  background-color: #ececec;
  padding: 20px;
  width: 90%;
  margin: 10px 5%;
  border-radius: 15px;

  > p {
    line-height: 20px;
  }

  @media (max-width: 750px) {
    width: calc(100% - 40px);
    margin: 0px;
    /* margin: 10px 10%; */
  }
`;

const DiscountText = styled.p`
  font-size: 14px;
  font-weight: 400;
  padding: 10px 0px;
`;

const EventRegisterFormLoadingCard = styled(EventRegisterCard)`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EventRegisterTextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventRegisterMobileTextContainer = styled.div`
  display: none;

  @media (max-width: 450px) {
    /* position: absolute; */
    /* top: 60px; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 0px;
  }
`;

const EventRegisterText = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 20px 5% 0px 5%;
  width: 50%;

  @media (max-width: 750px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  margin: 10px 5%;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`;

const TextContainer = styled.div`
  margin: 10px 5% !important;
  margin: 20px 5% 0px 5% !important;
  overflow: visible;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 750px) {
    display: none;
  }
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  text-align: right;

  > span {
    cursor: pointer;
    color: #2b8397;
    text-decoration: underline;
  }
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(EventRegisterForm);
