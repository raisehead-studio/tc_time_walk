import React from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";

import { handleFetchVideoData } from "../util/api"

const EventRegisterForm = (props) => {
    const { eventId } = props.match.params;
    const [ state, setState ] = React.useState({
        eventData: {},
        name: "",
        tel: "",
        eventName: "",
        note: "",
    });

    React.useEffect(()=>{
        if(eventId){
            handleFetchVideoData(eventId)
            .then(res=>{
                const { data, status } = res;

                if(status === 200 && data){
                    setState(state => ({ ...state, eventData: data }))
                }
            })
        }
    }, [])
    
    return (
        <EventRegisterFormWrapper>
            <EventRegisterCard>
                <EventRegisterTextContainer>
                    <EventRegisterText>報名{state.eventData.videoName}活動 :</EventRegisterText>
                </EventRegisterTextContainer>
                <Inputs
                    label="姓名"
                    // value={state.videoName}
                    // onChange={handleChange}
                    name="videoName"
                />
                            <Inputs
                    label="聯絡電話"
                    // value={state.videoName}
                    // onChange={handleChange}
                    name="videoName"
                />
                            <Inputs
                    label="活動名稱"
                    // value={state.videoName}
                    // onChange={handleChange}
                    name="videoName"
                />
                            <Inputs
                    label="備註"
                    // value={state.videoName}
                    // onChange={handleChange}
                    name="videoName"
                />
            </EventRegisterCard>

        </EventRegisterFormWrapper>
      );
};


const EventRegisterFormWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 90%;
`

const EventRegisterCard = styled(Card)`
    width: 100%;
    margin-top: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const EventRegisterTextContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
`

const EventRegisterText = styled.h2`
    font-size: 1.25rem;
    font-weight: 700;
    margin: 20px 5% 0px 5%;
`

const Inputs = styled(TextField)`
  margin: 10px 5% !important;
  width: ${(p) => `${p.width ? p.width : "90"}%`};

  .MuiFormControl-root {
    margin: 10px 0px;
  }
`;

export default EventRegisterForm;