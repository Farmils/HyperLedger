import {createContext} from "react";

const Context = createContext({});
const ContextProvider = ({ children }) => {
    const values = {

    }
    return <Context.Provider value={values}>{children}</Context.Provider>;
}
export { ContextProvider,Context };