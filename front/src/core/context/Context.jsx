import { createContext, useState } from "react";
const Context = createContext({});
const ContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");

  const values = {
    userId,
    setUserId,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export { ContextProvider, Context };
