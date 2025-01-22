import { Header } from "../../components/header/Header.jsx";
import { Profile } from "../../components/profile/Profile.jsx";
import {InfoForCar} from "../../components/car/infoForCar/InfoForCar.jsx";

const ProfilePage = () => {
  return (
    <>
      <Header />
      <Profile />
        <InfoForCar/>
    </>
  );
};
export { ProfilePage };
