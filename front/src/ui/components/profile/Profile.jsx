import { useContext, useEffect } from "react";
import { Context } from "../../../core/context/Context.jsx";
import { Card, CardBody, CardSubtitle } from "react-bootstrap";
import {DriverLicenseInProfile} from "../driverLicense/driverLicenseInProfile/DriverLicenseInProfile.jsx";

const Profile = () => {
  const { profileData, setProfileData, org, userId } = useContext(Context);
  useEffect(() => {
    if (userId !== "") {
      (async () => {
        const response = await fetch(
          `http://localhost:7000/getUser?organization=${org}&userID=${userId}`,
        );

        const data = await response.json();
        setProfileData(data);
        console.log(data);
      })();
    }
  },[org,userId]);
  return (
    <div className={"d-flex flex-column justify-content-center align-items-center m-3"}>
      <Card
        className={"d-flex  text-center"}
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
  <DriverLicenseInProfile/>
    </div>
  );
};
export { Profile };
