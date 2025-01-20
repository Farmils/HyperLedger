import { createContext, useState } from "react";
const Context = createContext({});
const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [org, setOrg] = useState("");
  const [profileData, setProfileData] = useState({});

  const values = {
    userId,
    setUserId,
    org,
    setOrg,
    profileData,
    setProfileData,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
