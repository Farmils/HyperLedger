import { createContext, useState } from "react";
const Context = createContext({});
const initialStateProfile = {
  FIO: "",
  UserID: "",
  StartDrive: "",
  Balance: "",
  CountForfeit: "",
};
const initialStateLicense ={
  ID:"",
  serviceLife:"",
  Category:"",
  userID:""
}
const initialStateCar={
  CarCategory:"",
  CarID:"",
  Owner:"",
  Price:"",
  serviceLife:""
}
const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [org, setOrg] = useState("");
  const [profileData, setProfileData] = useState(initialStateProfile);
  const [licenseId, setLicenseId] = useState("");
  const [licenseInform, setLicenseInform] = useState(initialStateLicense);
  const [carId, setCarId] = useState("");
  const [carInform, setCarInform] = useState(initialStateCar);
  const [toPolice, setToPolice] = useState(false);

  const values = {
    userId,
    setUserId,
    org,
    setOrg,
    profileData,
    setProfileData,
    licenseId,
    setLicenseId,
    licenseInform,
    setLicenseInform,
    carId,
    setCarId,
    carInform,
    setCarInform,
    toPolice,
    setToPolice
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
