import {
  Button,
  Form, FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../../core/context/Context.jsx";

const Authorization = ({ handleClose }) => {
  const nav = useNavigate("");

  const { setUserId, setOrg,setToPolice } = useContext(Context);

  const submitAuthorization = async (event) => {
    event.preventDefault();
    const organization = event.target[0].value;
    const userId = event.target[1].value;
    const password = event.target[2].value;
    const toPolice = event.target[3].checked;
    console.log(organization, userId,password);
    const response = await fetch(
      `http://localhost:7000/authorization?organization=${organization}&userID=${userId}`,
    );
    const data = await response.json();
    console.log(data);
    if (data.id === userId && data.password === password ) {
      nav("/");
      setUserId(userId);
      setOrg(organization);
    } else {
      throw new Error(`Вы не зарегистрированы в системе`);
    }
    setToPolice(toPolice);
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
      <FormGroup>
        <FormLabel className={"text-white"} column={1}>Введите пароль</FormLabel>
        <FormControl placeholder={"Zxqsd12_+"} type={"password"}></FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel className={"text-white"}>Вы явялетесь сотрудником дорожно-патрульной службы?</FormLabel>
        <FormCheck type={"checkbox"}></FormCheck>
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
