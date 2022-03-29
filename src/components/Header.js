import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import Menu from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";

import firebase from "../util/firebase";
import user from "../redux/user";
import Swal from "sweetalert2";

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const Header = ({ user }) => {
  const [state, setState] = React.useState({
    isMobileMenuOpen: false,
    freeWalkingHover: false,
    customizedTourHover: false,
    wantToJoinHover: false,
    myTripsHover: false,
    logOutHover: false,
    statusHover: false,
  });
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

  const toggleMobileMenu = () => {
    setState((state) => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  };

  const toggleMenuColor = (name) => {
    setState((state) => ({
      ...state,
      [name]: !state[name],
    }));
  };

  return (
    <HeaderContainer>
      <CloseMenuContainer open={state.isMobileMenuOpen}>
        <CloseIcon onClick={toggleMobileMenu} />
      </CloseMenuContainer>
      <MobileMenu open={state.isMobileMenuOpen}>
        {!isAdmin ? (
          <React.Fragment>
            <MobileMenuItem
              onClick={() => {
                user
                  ? window.open("https://forms.gle/sWdQsXTEQkMFFDEA7", "_blank")
                  : Swal.fire("請登入平台。");
              }}
            >
              <MobileMenuText>舊城文化小費導覽</MobileMenuText>
              <MobileMenuText>Free walking tour(Tips-based)</MobileMenuText>
            </MobileMenuItem>
            <MobileMenuItem
              onClick={() => {
                user
                  ? window.open("https://forms.gle/sWdQsXTEQkMFFDEA7", "_blank")
                  : Swal.fire("請登入平台。");
              }}
            >
              <MobileMenuText>任何導覽都歡迎提案</MobileMenuText>
              <MobileMenuText>Customized tour</MobileMenuText>
            </MobileMenuItem>
            <MobileMenuItem
              onClick={() => {
                handlePush(`/event_signup/${userId}`);
                toggleMobileMenu();
              }}
            >
              <MobileMenuText>報名活動</MobileMenuText>
              <MobileMenuText>Want to Join</MobileMenuText>
            </MobileMenuItem>
            <MobileMenuItem
              onClick={() => {
                handlePush(`/event_list/${userId}`);
                toggleMobileMenu();
              }}
            >
              <MobileMenuText>我的活動列表</MobileMenuText>
              <MobileMenuText>My trips</MobileMenuText>
            </MobileMenuItem>
            <MobileMenuItem
              onClick={() => {
                handlePush(`/sign_out`);
                toggleMobileMenu();
              }}
            >
              <MobileMenuText>登出</MobileMenuText>
              <MobileMenuText>Log out</MobileMenuText>
            </MobileMenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MobileMenuItem>
              <MobileMenuText>您目前位於「活動管理後台」</MobileMenuText>
              <MobileMenuText>You are at admin console</MobileMenuText>
            </MobileMenuItem>
            <MobileMenuItem
              onClick={() => {
                handlePush(`/sign_out`);
                toggleMobileMenu();
              }}
            >
              <MobileMenuText>登出</MobileMenuText>
              <MobileMenuText>Log out</MobileMenuText>
            </MobileMenuItem>
          </React.Fragment>
        )}
      </MobileMenu>
      <HeaderContainerInnerContainer>
        <HeaderContainerLeft>
          <HeaderIcon
            onClick={() => {
              window.open("https://www.tctimewalk.com/", "_blank");
            }}
            src={
              "https://tctimewalk.com/wp-content/uploads/2021/09/TC-Time-Walk_logo.svg"
            }
          />
        </HeaderContainerLeft>
        <HeaderContainerRight>
          {!isAdmin ? (
            <React.Fragment>
              <HeaderTextContainer
                onMouseEnter={() => toggleMenuColor("freeWalkingHover")}
                onMouseLeave={() => toggleMenuColor("freeWalkingHover")}
                onClick={() => {
                  user
                    ? window.open(
                        "https://forms.gle/sWdQsXTEQkMFFDEA7",
                        "_blank"
                      )
                    : Swal.fire("請登入平台。");
                }}
              >
                <HeaderSpan isHover={state.freeWalkingHover} />
                <HeaderText isHover={state.freeWalkingHover}>
                  舊城文化小費導覽
                </HeaderText>
                <HeaderText isHover={state.freeWalkingHover}>
                  Free walking tour(Tips-based)
                </HeaderText>
              </HeaderTextContainer>
              <HeaderTextContainer
                onMouseEnter={() => toggleMenuColor("customizedTourHover")}
                onMouseLeave={() => toggleMenuColor("customizedTourHover")}
                onClick={() => {
                  user
                    ? window.open(
                        "https://forms.gle/sWdQsXTEQkMFFDEA7",
                        "_blank"
                      )
                    : Swal.fire("請登入平台。");
                }}
              >
                <HeaderSpan isHover={state.customizedTourHover} />
                <HeaderText isHover={state.customizedTourHover}>
                  任何導覽都歡迎提案
                </HeaderText>
                <HeaderText isHover={state.customizedTourHover}>
                  Customized tour
                </HeaderText>
              </HeaderTextContainer>
              <HeaderTextContainer
                onClick={() => handlePush(`/event_signup/${userId}`)}
                onMouseEnter={() => toggleMenuColor("wantToJoinHover")}
                onMouseLeave={() => toggleMenuColor("wantToJoinHover")}
              >
                <HeaderSpan isHover={state.wantToJoinHover} />

                <HeaderText isHover={state.wantToJoinHover}>
                  報名活動
                </HeaderText>
                <HeaderText isHover={state.wantToJoinHover}>
                  Want to Join
                </HeaderText>
              </HeaderTextContainer>
              <HeaderTextContainer
                onClick={() => handlePush(`/event_list/${userId}`)}
                onMouseEnter={() => toggleMenuColor("myTripsHover")}
                onMouseLeave={() => toggleMenuColor("myTripsHover")}
              >
                <HeaderSpan isHover={state.myTripsHover} />

                <HeaderText isHover={state.myTripsHover}>
                  我的活動列表
                </HeaderText>
                <HeaderText isHover={state.myTripsHover}>My trips</HeaderText>
              </HeaderTextContainer>
              <HeaderTextContainer
                onClick={() => handlePush(`/sign_out`)}
                onMouseEnter={() => toggleMenuColor("logOutHover")}
                onMouseLeave={() => toggleMenuColor("logOutHover")}
              >
                <HeaderSpan isHover={state.logOutHover} />
                <HeaderText isHover={state.logOutHover}>登出</HeaderText>
                <HeaderText isHover={state.logOutHover}>Log out</HeaderText>
              </HeaderTextContainer>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <HeaderTextContainer
                onMouseEnter={() => toggleMenuColor("statusHover")}
                onMouseLeave={() => toggleMenuColor("statusHover")}
              >
                <HeaderSpan isHover={state.statusHover} />

                <HeaderText isHover={state.statusHover}>
                  您目前位於「活動管理後台」
                </HeaderText>
                <HeaderText isHover={state.statusHover}>
                  You are at admin console
                </HeaderText>
              </HeaderTextContainer>
              <HeaderTextContainer
                onMouseEnter={() => toggleMenuColor("logOutHover")}
                onMouseLeave={() => toggleMenuColor("logOutHover")}
                onClick={() => handlePush(`/sign_out`)}
              >
                <HeaderSpan isHover={state.logOutHover} />
                <HeaderText isHover={state.logOutHover}>登出</HeaderText>
                <HeaderText isHover={state.logOutHover}>Log out</HeaderText>
              </HeaderTextContainer>
            </React.Fragment>
          )}
        </HeaderContainerRight>
        <HeaderMobileRightContainer>
          <MenuIcon onClick={toggleMobileMenu} />
        </HeaderMobileRightContainer>
      </HeaderContainerInnerContainer>
    </HeaderContainer>
  );
};

const CloseIcon = styled(Close)`
  color: #fff;
`;

const CloseMenuContainer = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  right: ${(p) => (p.open ? "0px" : "-50px")};
  top: 20px;
  background-color: #000;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 0px 0px 5px;
  transition: 0.2s right linear;
`;

const MobileMenu = styled.div`
  width: 70vw;
  position: absolute;
  right: ${(p) => (p.open ? "0px" : "-80vw")};
  top: 0px;
  background-color: rgba(0, 0, 0, 0.9);
  min-height: 100vh;
  z-index: 100;
  padding-top: 80px;
  transition: 0.2s right linear;
`;

const MobileMenuItem = styled.div`
  width: calc(100% - 45px);
  padding: 20px 0px;
  margin: 0px 30px 0px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
`;

const MobileMenuText = styled.p`
  color: #fff;
  padding: 5px 0px;
`;

const HeaderMobileRightContainer = styled.div`
  display: none;

  @media (max-width: 960px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const MenuIcon = styled(Menu)``;

const HeaderContainer = styled.div`
  display: flex;
  background-color: #fff;
  width: 100vw;
  position: fixed;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
  height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
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
  color: ${(p) => (p.isHover ? "#f8e180" : "#3e3a39")};
  transition: 0.2s color ease;
`;

const HeaderSpan = styled.span`
  height: 2px;
  width: 100%;
  position: absolute;
  /* background-color: #f8e180; */
  background-color: ${(p) => (p.isHover ? "#f8e180" : "rgba(0,0,0,0)")};
  top: 32px;
  transition: 0.2s background-color ease;
`;

const HeaderContainerRight = styled.div`
  display: flex;
  align-items: center;
  visibility: ${(p) => (p.isAdmin ? "hidden" : "")};

  @media (max-width: 960px) {
    display: none;
  }
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Header);
