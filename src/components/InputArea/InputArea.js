import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DateTimePicker } from "@material-ui/pickers";

import { initClient, handleCreateEvents } from "../../util/create_event";
import { handleUpdateData, handleFetchData } from "../../util/api";
import {
  SelectForm,
  Inputs as CustomInput,
  CheckboxForm,
  DateInputForm,
  ButtonForm,
} from "../../styles/index";

const InputArea = ({ handleGetData }) => {
  const [state, setState] = React.useState({
    eventName: "",
    eventLink: "",
    description: "",
    price: "",
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    event: null,
  });

  React.useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://apis.google.com/js/api.js";

    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.gapi) handleClientLoad();
    });
  }, []);

  const handleClientLoad = () => {
    window.gapi.load("client:auth2", initClient);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((state) => ({ ...state, [name]: value }));
  };

  const handleDateChange = (val, name) => {
    const startDateUnix = new Date(val).getTime();
    setState((state) => ({ ...state, [name]: startDateUnix }));
  };

  const formatDateString = (val) => {
    const updateVal = val - 8 * 60 * 60 * 1000;

    const date = new Date(updateVal);
    const monthOrigin = date.getMonth();
    let month;
    if (monthOrigin < 9) {
      month = `0${monthOrigin + 1}`;
    } else {
      month = monthOrigin + 1;
    }
    return `${date.getFullYear()}-${month}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00Z`;
  };

  const handleUpdateDatas = () => {
    const data = {
      eventName: state.eventName,
      eventLink: state.eventLink,
      startDate: state.startDate,
      endDate: state.endDate,
      summary: state.description,
      subscription: [""],
      price: +state.price,
    };
    setState((state) => ({ ...state, isLoading: true }));
    handleUpdateData(data).then((res) => {
      const eventData = {
        summary: state.eventName,
        location: "",
        description:
          state.description +
          `http://localhost:3000/event_signup/${res.data.name}`,
        start: {
          dateTime: formatDateString(state.startDate),
          timeZone: "Asia/Taipei",
        },
        end: {
          dateTime: formatDateString(state.endDate),
          timeZone: "Asia/Taipei",
        },
        recurrence: [],
        attendees: [],
        reminders: {
          useDefault: true,
        },
      };
      handleCreateEvents(eventData);
      setState((state) => ({
        ...state,
        eventName: "",
        eventLink: "",
        description: "",
        price: "",
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        event: null,
        isLoading: false,
      }));
      handleGetData();
    });
  };

  return (
    <InputAreaWrapper>
      <InputAreaWrapperHeaderContainer>
        <InputAreaWrapperHeader>新增活動</InputAreaWrapperHeader>
      </InputAreaWrapperHeaderContainer>
      <InputAreaWrapperCol>
        <Inputs
          label="活動名稱"
          value={state.eventName}
          onChange={handleChange}
          width={50}
          name="eventName"
        />
        <Inputs
          label="活動連結"
          value={state.eventLink}
          onChange={handleChange}
          width={50}
          name="eventLink"
        />
      </InputAreaWrapperCol>
      <InputAreaWrapperCol>
        <Inputs
          label="活動描述"
          value={state.description}
          onChange={handleChange}
          width={100}
          name="description"
        />
      </InputAreaWrapperCol>
      <InputAreaWrapperCol>
        <DateInputs
          label="活動開始時間"
          value={state.startDate}
          onChange={(val) => handleDateChange(val, "startDate")}
          width={33}
          name={"startDate"}
        />
        <DateInputs
          label="活動開始時間"
          value={state.endDate}
          onChange={(val) => handleDateChange(val, "endDate")}
          width={33}
          name={"endDate"}
        />
        <Inputs
          label="報名活動價錢"
          value={state.price}
          onChange={handleChange}
          width={33}
          name="price"
          type="number"
        />
      </InputAreaWrapperCol>
      <ButtonsContainer>
        <Buttons
          // disabled={
          //   !state.eventName ||
          //   !state.eventLink ||
          //   !state.description ||
          //   !state.price ||
          //   state.startDate === new Date() ||
          //   state.endDate === new Date()
          // }
          onClick={handleUpdateDatas}
        >
          新增活動
        </Buttons>
      </ButtonsContainer>
    </InputAreaWrapper>
  );
};

const InputAreaWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
  width: 100%;
  transform: translateY(70px);
`;

const InputAreaWrapperHeaderContainer = styled.div`
  display: flex;
  padding: 10px 10px 0px 10px;
  font-size: 2rem;
`;

const InputAreaWrapperHeader = styled.h2`
  font-weight: 700;
`;

const InputAreaWrapperCol = styled.div`
  width: 100%;
  display: flex;
`;

const Inputs = styled(CustomInput)`
  margin: 10px !important;
  width: ${(p) => `${p.width}%`};

  .MuiFormControl-root {
    margin: 10px 0px;
  }
`;

const DateInputs = styled(DateTimePicker)`
  margin: 10px !important;
  width: ${(p) => `${p.width}%`};
`;

const ButtonsContainer = styled.div`
  padding: 10px;
`;

const Buttons = styled(Button)`
  color: ${(p) => `${!p.disabled ? "#fff" : "#ececec"} !important`};
  background-color: ${(p) =>
    `${!p.disabled ? "#2b8397" : "#777777"} !important`};
`;

export default InputArea;
