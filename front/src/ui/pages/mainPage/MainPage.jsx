import { Header } from "../../components/header/Header.jsx";
import { AddDriverLicense } from "../../components/driverLicense/addDriverLicense/AddDriverLicense.jsx";
import {AddCar} from "../../components/car/addCar/AddCar.jsx";
import {AddForfeit} from "../../components/forfeit/addForfeit/AddForfeit.jsx";
import {useContext} from "react";
import {Context} from "../../../core/context/Context.jsx";
import {PayForfeit} from "../../components/forfeit/payForfeit/PayForfeit.jsx";
import {RenewLicense} from "../../components/driverLicense/renewLicense/RenewLicense.jsx";

const MainPage = () => {
    const {toPolice} = useContext(Context);
  return (

    <>
      <Header />
        <div className={"d-flex flex-column align-items-center m-4"} >
      <AddDriverLicense />
            <RenewLicense/>
            <AddCar />
            <PayForfeit/>
            {toPolice === true ? (
                <AddForfeit/>

                ):<></>
            }

        </div>
    </>
  );
};
export { MainPage };
