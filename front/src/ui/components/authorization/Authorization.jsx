import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../../core/context/Context.jsx";

const Authorization = ({ handleClose }) => {
  const nav = useNavigate("");

  const { setUserId, setOrg } = useContext(Context);

  const submitAuthorization = async (event) => {
    event.preventDefault();
    const organization = event.target[0].value;
    const userId = event.target[1].value;
    console.log(organization, userId);
    const response = await fetch(
      `http://localhost:7000/authorization?organization=${organization}&userID=${userId}`,
    );
    const data = await response.text();
    console.log(data);
    if (data.toLowerCase().toString() === userId.toLowerCase().toString()) {
      nav("/");
      setUserId(userId);
      setOrg(organization);
    } else {
      throw new Error(`Вы не зарегистрированы в системе`);
    }
    nav("/main");
    handleClose();
  };

  return (
    <Form style={{ width: "25rem" }} onSubmit={submitAuthorization}>
      <FormGroup>
        <FormLabel className={"text-white"} column={1}>
          Укажите организацию к которой вы относитесь
        </FormLabel>
        <FormControl placeholder={"org1"} type={"text"}></FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel className={"text-white"} column={1}>
          Введите ID вашего пользователя
        </FormLabel>
        <FormControl placeholder={"admin"} type={"text"}></FormControl>
      </FormGroup>
      <Button
        type={"submit"}
        variant={"success"}
        style={{ marginTop: "10px", width: "25rem" }}
      >
        Авторизоваться
      </Button>
    </Form>
  );
};

export { Authorization };
