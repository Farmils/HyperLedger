import { Registration } from "../../components/registration/Registration.jsx";
import { Header } from "../../components/header/Header.jsx";
import { Authorization } from "../../components/authorization/Authorization.jsx";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import "./RegistrationOrAuthorization.css";
const RegistrationOrAuthorizationPage = () => {
  const [regShow, setRegShow] = useState(false);
  const [authShow, setAuthShow] = useState(false);
  const handleAuthClose = () => {
    setAuthShow(false);
  };
  const handleAuthShow = () => {
    setAuthShow(true);
  };
  const handleRegClose = () => {
    setRegShow(false);
  };
  const handleRegShow = () => {
    setRegShow(true);
  };
  return (
    <>
      <Header />
      <div
        className={"d-flex justify-content-center align-items-center m-lg-5"}
      >
        <Button
          style={{ width: "250px", height: "100px", marginRight: "10px" }}
          variant={"info"}
          onClick={handleRegShow}
        >
          Зарегистрироваться
        </Button>
        <Modal
          className={"special-modal"}
          show={regShow}
          onHide={handleRegClose}
          style={{ width: "100%" }}
          fullscreen={true}
          centered={true}
        >
          <Modal.Header className={"text-white fs-4"}>
            {" "}
            Регистрация
          </Modal.Header>
          <Modal.Body>
            <Registration handleClose={handleRegClose} />;
          </Modal.Body>
        </Modal>

        <Button
          style={{ width: "250px", height: "100px", marginLeft: "10px" }}
          variant={"info"}
          onClick={handleAuthShow}
        >
          Авторизоваться
        </Button>
        <Modal
          onHide={handleAuthClose}
          show={authShow}
          className={"special-modal"}
          centered={true}
        >
          <Modal.Header className={"text-white fs-4"}>Авторизация</Modal.Header>
          <Modal.Body>
            <Authorization handleClose={handleAuthClose} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export { RegistrationOrAuthorizationPage };
