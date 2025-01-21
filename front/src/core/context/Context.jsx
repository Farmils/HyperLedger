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
const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [org, setOrg] = useState("");
  const [profileData, setProfileData] = useState(initialStateProfile);
  const [licenseId, setLicenseId] = useState("");
  const [licenseInform, setLicenseInform] = useState(initialStateLicense);

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
    setLicenseInform
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
