import { Header } from "../../components/header/Header.jsx";
import { AddDriverLicense } from "../../components/driverLicense/addDriverLicense/AddDriverLicense.jsx";
import {AddCar} from "../../components/car/addCar/AddCar.jsx";

const MainPage = () => {
  return (
    <>
      <Header />
        <div className={"d-flex flex-row align-items-center m-4"}>
      <AddDriverLicense />
        <AddCar />
        </div>
    </>
  );
};
export { MainPage };
