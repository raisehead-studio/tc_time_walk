import styled from "styled-components";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";

import firebase from "../util/firebase";
import user from "../redux/user";
import Swal from "sweetalert2";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const Header = ({ user }) => {
  const history = useHistory();
  const { isAdmin } = useSelector((state) => state.user);
  let userId = user ? user.multiFactor.user.uid : "";

  const handlePush = (url) => {
    if (user) {
      history.push(url);
    } else {
      Swal.fire("請登入平台。");
    }
  };

  return (
    <HeaderContainer>
      <HeaderContainerInnerContainer>
        <HeaderContainerLeft>
          <HeaderIcon
            src={
              "https://tctimewalk.studios-coming.com/wp-content/uploads/2021/09/TC-Time-Walk_logo.svg"
            }
          />
        </HeaderContainerLeft>
        <HeaderContainerRight isAdmin={isAdmin}>
          <HeaderTextContainer
            onClick={() => {
              user
                ? window.open(
                    "https://docs.google.com/forms/d/e/1FAIpQLSeI8_vYyaJgM7SJM4Y9AWfLq-tglWZh6yt7bEXEOJr_L-hV1A/viewform?formkey=dGx0b1ZrTnoyZDgtYXItMWVBdVlQQWc6MQ",
                    "_blank"
                  )
                : Swal.fire("請登入平台。");
            }}
          >
            <HeaderText>建議行程</HeaderText>
          </HeaderTextContainer>
          <HeaderTextContainer
            onClick={() => handlePush(`/event_signup/${userId}`)}
          >
            <HeaderText>報名活動</HeaderText>
          </HeaderTextContainer>
          <HeaderTextContainer
            onClick={() => handlePush(`/event_list/${userId}`)}
          >
            <HeaderText>活動列表</HeaderText>
          </HeaderTextContainer>
        </HeaderContainerRight>
      </HeaderContainerInnerContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  background-color: #fff;
  width: 100vw;
  position: fixed;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContainerInnerContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderContainerLeft = styled.div``;

const HeaderIcon = styled.img`
  width: 170px;
  height: 25px;
`;

const HeaderTextContainer = styled.div`
  padding: 0px 15px;
  transition: 0.2s;
  height: 47px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transition: 0.2s;
    border-bottom: 3px solid #f8e180;
  }
`;

const HeaderText = styled.p`
  color: #3e3a39;
  letter-spacing: 1.4px;
  line-height: 1.6px;
  font-weight: 400;
  font-size: 12px;
  transition: 0.2s;
  cursor: pointer;
  text-align: center;
  /* height: 47px; */
  &:hover {
    transition: 0.2s;
    color: #f8e180;
  }
`;

const HeaderContainerRight = styled.div`
  display: flex;
  align-items: center;
  visibility: ${(p) => (p.isAdmin ? "hidden" : "")};
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Header);
