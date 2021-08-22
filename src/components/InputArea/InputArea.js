import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DateTimePicker } from "@material-ui/pickers";

const InputArea = ({ handleUpdate }) => {
  const [state, setState] = React.useState({
    videoName: "",
    videoLink: "",
    startDate: new Date().getTime(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((state) => ({ ...state, [name]: value }));
  };

  const handleDateChange = (val) => {
    const startDateUnix = new Date(val).getTime();
    setState((state) => ({ ...state, startDate: startDateUnix }));
  };

  const handleUpdateData = () => {
    const data = {
      videoName: state.videoName,
      videoLink: state.videoLink,
      startDate: state.startDate,
    };
    handleUpdate(data);
    setState((state) => ({
      ...state,
      videoName: "",
      videoLink: "",
      startDate: new Date().getTime(),
    }));
  };

  return (
    <InputAreaWrapper>
      <Inputs
        label="活動名稱"
        value={state.videoName}
        onChange={handleChange}
        width={25}
        name="videoName"
      />
      <Inputs
        label="活動連結"
        value={state.videoLink}
        onChange={handleChange}
        width={40}
        name="videoLink"
      />
      <DateInputs
        label="活動時間"
        value={state.startDate}
        onChange={handleDateChange}
        width={20}
      />
      <Buttons
        disabled={
          !state.videoLink || !state.videoName || state.startDate === new Date()
        }
        onClick={handleUpdateData}
      >
        新增活動
      </Buttons>
    </InputAreaWrapper>
  );
};

const InputAreaWrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translateY(20px);
`;
const Inputs = styled(TextField)`
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

const Buttons = styled(Button)`
  color: ${(p) => `${!p.disabled ? "#fff" : "#ececec"} !important`};
  background-color: ${(p) =>
    `${!p.disabled ? "rgb(255, 87, 51)" : "#777777"} !important`};
`;

export default InputArea;
