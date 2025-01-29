import { Header } from "../../components/header/Header.jsx";
import { AddDriverLicense } from "../../components/driverLicense/addDriverLicense/AddDriverLicense.jsx";
import {AddCar} from "../../components/car/addCar/AddCar.jsx";
import {AddForfeit} from "../../components/forfeit/addForfeit/AddForfeit.jsx";
import {useContext} from "react";
import {Context} from "../../../core/context/Context.jsx";

const MainPage = () => {
    const {toPolice} = useContext(Context);
  return (

    <>
      <Header />
        <div className={"d-flex flex-column align-items-center m-4"} >
      <AddDriverLicense />
            <AddCar />
            {toPolice === true ? (
                <AddForfeit/>

                ):<></>
            }
        </div>
    </>
  );
};
export { MainPage };
