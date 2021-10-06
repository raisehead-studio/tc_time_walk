import styled from "styled-components";

const Spinner = ({ isRePosition }) => {
  return (
    <SpinnerOuterContainer isRePosition={isRePosition}>
      <SpinnerWrapper>
        <div className="loader" />
      </SpinnerWrapper>
    </SpinnerOuterContainer>
  );
};

const SpinnerOuterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${(p) => (p.isRePosition ? "translateY(-150px)" : "")};
`;

const SpinnerWrapper = styled.div`
  min-height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .loader,
  .loader:before,
  .loader:after {
    background: #2b8397;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }
  .loader {
    color: #2b8397;
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    position: absolute;
    top: 0;
    content: "";
  }
  .loader:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 1.5em;
  }
  @-webkit-keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }
    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
`;

export default Spinner;
