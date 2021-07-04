import Modal from "react-overlays/Modal";
import styled from "styled-components";
import { FC } from "react";
import { Spinner } from "reactstrap";

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;

const StyledModal = styled(Modal)`
  //position: fixed;
  //width: 400px;
  //z-index: 1040;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1050;
  color: white;
`;

const LoadingOverlay: FC = ({ children }) => {
  const renderBackdrop = (props: any) => <Backdrop {...props} />;

  return (
    <StyledModal show={true} renderBackdrop={renderBackdrop}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Spinner style={{ margin: "0 auto" }} type="grow" color="secondary" />
        <div>{children}</div>
      </div>
    </StyledModal>
  );
};

export default LoadingOverlay;
