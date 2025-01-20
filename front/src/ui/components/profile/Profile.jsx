import { useContext, useEffect } from "react";
import { Context } from "../../../core/context/Context.jsx";
import { Card, CardBody, CardSubtitle } from "react-bootstrap";

const Profile = () => {
  const { profileData, setProfileData, org, userId } = useContext(Context);
  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://localhost:7000/getUser?organization=${org}&userID=${userId}`,
      );

      const data = await response.json();
      setProfileData(data);
    })();
  });
  return (
    <div className={"d-flex justify-content-center align-items-center"}>
      {
        <Card
          className={"d-flex justify-content-center align-items-center"}
          style={{ width: "25rem" }}
        >
          <Card.Title>ФИО: {profileData.FIO.toString()}</Card.Title>
          <CardBody>
            <CardSubtitle>ID: {profileData.UserID.toString()}</CardSubtitle>
            <Card.Text>
              Начало Водительского стажа: {profileData.StartDrive.toString()}
            </Card.Text>
            <Card.Text>Баланс: {profileData.Balance.toString()}</Card.Text>
            <Card.Text>
              Количество неоплаченных штрафов:{" "}
              {profileData.CountForfeit.toString()}
            </Card.Text>
          </CardBody>
        </Card>
      }
    </div>
  );
};
export { Profile };
