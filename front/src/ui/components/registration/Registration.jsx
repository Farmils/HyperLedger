import { Button, Form, FormLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../../core/context/Context.jsx";

const Registration = () => {
  const { setUserId, userId } = useContext(Context);
  const nav = useNavigate("");
  const submitRegistration = async (event) => {
    event.preventDefault();
    const organization = event.target[0].value;
    const userId = event.target[1].value;
    const fio = event.target[2].value;
    const startDrive = event.target[3].value;
    const countForfeit = event.target[4].value;
    const balance = event.target[5].value;
    const response = await fetch("http://localhost:7000/registration", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        organization: organization,
        userID: userId,
        fio: fio,
        startDrive: startDrive,
        countForfeit: countForfeit,
        balance: balance,
      }),
    });
    response.json().then((data) => {
      console.log(data);
    });
    nav("/main");
    setUserId(userId);
  };
  return (
    <>
      {userId === "" && (
        <div className={"d-flex flex-column align-items-center"}>
          <p className={"text-white fs-4 m-1"}>Регистрация</p>
          <Form
            style={{ padding: "10px", width: "35rem" }}
            className={"d-flex flex-column"}
            onSubmit={submitRegistration}
          >
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите организацию к которой вы относитесь
              </FormLabel>
              <Form.Control type={"string"} placeholder={"org1"}></Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите ID вашего пользователя
              </FormLabel>
              <Form.Control
                type={"new-password"}
                placeholder={"admin"}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите ваше ФИО
              </FormLabel>
              <Form.Control
                type={"string"}
                placeholder={"Продажный Иван Федорович"}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите дату начала водительского стажа
              </FormLabel>
              <Form.Control type={"date"}></Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите количество ваших штрафов
              </FormLabel>
              <Form.Control
                type={"number"}
                min={0}
                placeholder={"12"}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <FormLabel column={1} className={"text-white"}>
                Укажите ваш баланс
              </FormLabel>
              <Form.Control
                type={"number"}
                min={0}
                placeholder={"10"}
              ></Form.Control>
            </Form.Group>
            <Button
              type="submit"
              variant={"success"}
              style={{ marginTop: "12px" }}
            >
              Зарегистрироваться
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};
export { Registration };
