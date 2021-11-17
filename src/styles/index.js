import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

const Selects = styled(Select)`
  width: 100%;

  .MuiFormControl-root {
    margin: 10px 0px;
  }
`;

const SelectionFormWrapper = styled.div`
  margin: 10px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};

  > li {
    padding: 0px;
    color: #7a7a7a;
    width: 100%;
    word-break: break-all;
    font-size: 10px;
  }
  .MuiInput-underline:after {
    border-bottom: 2px solid #2b8397 !important;
  }
`;

export const SelectForm = ({
  options,
  onChange,
  label,
  disabled,
  value,
  name,
}) => {
  return (
    <SelectionFormWrapper>
      <CustomInputLabel>{label}</CustomInputLabel>
      <Selects
        disabled={disabled}
        onChange={(e) => onChange(e)}
        value={value}
        name={name}
      >
        {options.map((option) => (
          <MenuItem value={option.id} key={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Selects>
    </SelectionFormWrapper>
  );
};

const CustomInputLabel = styled(InputLabel)`
  width: 100%;
  word-break: break-all;
  font-size: 10px;
`;

const Input = styled(TextField)`
  margin: 10px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};

  .MuiFormLabel-root {
    width: 100%;
    word-break: break-all;
    font-size: 10px !important;
  }

  .MuiFormControl-root {
    margin: 13px 0px;
    width: 100%;
  }

  .MuiFormLabel-root.Mui-focused {
    color: #2b8397;
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid #2b8397 !important;
  }
`;

export const Inputs = (props) => <Input {...props} />;

export const CheckboxForm = ({ label, onChange, options, value }) => {
  return (
    <CheckboxFormWrapper>
      <InputLabel>{label}</InputLabel>
      {options.map((option) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={value === option.returnVal}
              onClick={() => onChange(option.returnVal)}
            />
          }
          label={option.name}
        />
      ))}
    </CheckboxFormWrapper>
  );
};

const CheckboxFormWrapper = styled.div`
  margin: 10px 5% 0px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};
  > li {
    padding: 0px;
    color: #7a7a7a;
  }
  .MuiCheckbox-colorSecondary.Mui-checked {
    color: #2b8397;
  }
`;

export const DateInputForm = ({ label, onChange, value }) => {
  return (
    <DateInputFormWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          views={["day"]}
          label={label}
          value={value}
          disabled
          onChange={(newValue) => {
            console.log(newValue);
          }}
          renderInput={(params) => (
            <DateInputs {...params} helperText={null} width={100} />
          )}
        />
      </LocalizationProvider>
    </DateInputFormWrapper>
  );
};

const DateInputFormWrapper = styled.div`
  margin: 10px 5% 0px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};
  > li {
    padding: 0px;
    color: #7a7a7a;
  }
`;

const DateInput = styled(TextField)`
  margin: 0px !important;
  width: 100%;

  .MuiFormControl-root {
    margin: 10px 0px;
  }
  .MuiFormLabel-root.Mui-focused {
    color: #2b8397;
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid #2b8397;
  }
`;

export const DateInputs = (props) => <DateInput {...props} />;

export const ButtonForm = ({ onClick, label, active }) => {
  return (
    <Buttons active={active} onClick={onClick}>
      {label}
    </Buttons>
  );
};

const Buttons = styled(Button)`
  background-color: ${(p) => (p.active ? "#2b8397" : "#ececec")} !important;
  color: #fff !important;
  padding: 10px !important;
  cursor: ${(p) => (p.active ? "pointer" : "not-allowed")} !important;
`;
